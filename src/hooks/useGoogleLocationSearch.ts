import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "";

export interface LocationPrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface LocationDetails {
  name: string;
  latitude: number;
  longitude: number;
  formatted_address: string;
  place_id: string;
}

interface UseGoogleLocationSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
  types?: string[];
  autoInitialize?: boolean;
  defaultQuery?: string;
}

interface UseGoogleLocationSearchReturn {
  predictions: LocationPrediction[];
  isLoading: boolean;
  isInitialized: boolean;
  searchLocations: (query: string) => Promise<void>;
  getLocationDetails: (placeId: string) => Promise<LocationDetails | null>;
  clearPredictions: () => void;
  autocompleteService: React.MutableRefObject<google.maps.places.AutocompleteService | null>;
  placesService: React.MutableRefObject<google.maps.places.PlacesService | null>;
  initializeGoogleMaps: () => void;
  error: string | null;
}

// Global state management for Google Maps loading
declare global {
  interface Window {
    googleMapsInitPromise?: Promise<void>;
    googleMapsLoaded?: boolean;
  }
}

export const useGoogleLocationSearch = (
  options: UseGoogleLocationSearchOptions = {}
): UseGoogleLocationSearchReturn => {
  const {
    debounceMs = 300,
    minQueryLength = 1,
    maxResults = 20,
    types = ["establishment", "geocode"],
    autoInitialize = true,
    defaultQuery = "",
  } = options;

  // States
  const [predictions, setPredictions] = useState<LocationPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const initAttempts = useRef(0);
  const maxInitAttempts = 5;
  const shouldExecuteDefaultQuery = useRef(false);

  // Check if Google Maps is available
  const isGoogleMapsAvailable = useCallback((): boolean => {
    return !!(
      typeof window !== "undefined" &&
      window.google?.maps?.places?.AutocompleteService &&
      window.google?.maps?.places?.PlacesService
    );
  }, []);

  // Load Google Maps API
  const loadGoogleMapsAPI = useCallback((): Promise<void> => {
    // Return existing promise if already loading
    if (window.googleMapsInitPromise) {
      return window.googleMapsInitPromise;
    }

    // Return resolved promise if already loaded
    if (isGoogleMapsAvailable()) {
      window.googleMapsLoaded = true;
      return Promise.resolve();
    }

    // Check if API key is available
    if (!GOOGLE_MAPS_API_KEY) {
      const errorMsg = "Google Maps API key is missing";
      setError(errorMsg);
      return Promise.reject(new Error(errorMsg));
    }

    window.googleMapsInitPromise = new Promise((resolve, reject) => {
      try {
        // Remove any existing script
        const existingScript = document.querySelector(
          'script[src*="maps.googleapis.com"]'
        );
        if (existingScript) {
          existingScript.remove();
        }

        // Create new script
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
        script.async = true;
        script.defer = true;

        // Global callback function
        (window as Window & { initGoogleMaps?: () => void }).initGoogleMaps =
          () => {
            const checkReady = () => {
              if (isGoogleMapsAvailable()) {
                window.googleMapsLoaded = true;
                delete (window as Window & { initGoogleMaps?: () => void })
                  .initGoogleMaps;
                resolve();
              } else {
                setTimeout(checkReady, 50);
              }
            };
            checkReady();
          };

        script.onerror = () => {
          setError("Failed to load Google Maps API");
          delete window.googleMapsInitPromise;
          delete (window as Window & { initGoogleMaps?: () => void })
            .initGoogleMaps;
          reject(new Error("Failed to load Google Maps API"));
        };

        document.head.appendChild(script);

        // Timeout fallback
        setTimeout(() => {
          if (!window.googleMapsLoaded) {
            setError("Google Maps API loading timeout");
            reject(new Error("Google Maps API loading timeout"));
          }
        }, 10000);
      } catch (err) {
        setError("Error loading Google Maps API");
        reject(err);
      }
    });

    return window.googleMapsInitPromise;
  }, [isGoogleMapsAvailable]);

  // Initialize services
  const initializeServices = useCallback((): boolean => {
    try {
      if (isGoogleMapsAvailable()) {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();

        // Create a dummy div for PlacesService
        const dummyDiv = document.createElement("div");
        dummyDiv.style.display = "none";
        document.body.appendChild(dummyDiv);
        placesService.current = new window.google.maps.places.PlacesService(
          dummyDiv
        );

        setIsInitialized(true);
        setError(null);

        // Mark that we should execute default query
        if (defaultQuery && defaultQuery.length >= minQueryLength) {
          shouldExecuteDefaultQuery.current = true;
        }

        return true;
      }
      return false;
    } catch (err) {
      console.error("Error initializing Google Maps services:", err);
      setError("Failed to initialize location services");
      return false;
    }
  }, [isGoogleMapsAvailable, defaultQuery, minQueryLength]);

  // Main initialization function
  const initializeGoogleMaps = useCallback(async (): Promise<void> => {
    if (isInitialized) return;

    initAttempts.current += 1;

    try {
      setError(null);

      // Check if already available
      if (isGoogleMapsAvailable()) {
        initializeServices();
        return;
      }

      // Load API
      await loadGoogleMapsAPI();

      // Initialize services
      if (!initializeServices()) {
        throw new Error("Failed to initialize services after API load");
      }
    } catch (err) {
      console.error("Google Maps initialization error:", err);

      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);

      // Retry with exponential backoff
      if (initAttempts.current < maxInitAttempts) {
        const retryDelay = Math.min(
          1000 * Math.pow(2, initAttempts.current - 1),
          8000
        );

        setTimeout(() => {
          initializeGoogleMaps();
        }, retryDelay);
      } else {
        const finalError =
          "Failed to initialize location services after multiple attempts. Please refresh the page.";
        setError(finalError);
        toast.error(finalError);
      }
    }
  }, [
    isInitialized,
    isGoogleMapsAvailable,
    loadGoogleMapsAPI,
    initializeServices,
  ]);

  // Search locations
  const searchLocations = useCallback(
    async (query: string): Promise<void> => {
      const effectiveQuery = query.trim() || defaultQuery?.trim() || "";

      if (!effectiveQuery || effectiveQuery.length < minQueryLength) {
        setPredictions([]);
        return;
      }

      // Initialize if not ready
      if (!isInitialized) {
        if (autoInitialize) {
          await initializeGoogleMaps();
        }
        return;
      }

      if (!autocompleteService.current) {
        console.warn("AutocompleteService not available");
        return;
      }

      // Clear existing timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      setIsLoading(true);
      setError(null);

      debounceTimer.current = setTimeout(() => {
        const request: google.maps.places.AutocompletionRequest = {
          input: effectiveQuery,
          types: types as string[],
        };

        try {
          autocompleteService.current!.getPlacePredictions(
            request,
            (predictions, status) => {
              setIsLoading(false);

              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                predictions
              ) {
                const limitedPredictions = predictions.slice(0, maxResults);
                setPredictions(limitedPredictions);
                setError(null);
              } else if (
                status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS
              ) {
                setPredictions([]);
                setError(null);
              } else {
                console.error("Places prediction error:", status);
                setPredictions([]);

                // Handle specific errors
                if (
                  status ===
                  google.maps.places.PlacesServiceStatus.REQUEST_DENIED
                ) {
                  setError(
                    "Location search access denied. Please check API key."
                  );
                } else if (
                  status ===
                  google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT
                ) {
                  setError("Location search quota exceeded.");
                } else {
                  setError("Location search temporarily unavailable.");
                }
              }
            }
          );
        } catch (err) {
          setIsLoading(false);
          console.error("Search error:", err);
          setError("Search error occurred");
          setPredictions([]);
        }
      }, debounceMs);
    },
    [
      defaultQuery,
      minQueryLength,
      isInitialized,
      autoInitialize,
      initializeGoogleMaps,
      debounceMs,
      maxResults,
      types,
    ]
  );

  // Get location details
  const getLocationDetails = useCallback(
    async (placeId: string): Promise<LocationDetails | null> => {
      if (!isInitialized || !placesService.current) {
        console.warn("PlacesService not initialized");
        return null;
      }

      return new Promise((resolve) => {
        const request: google.maps.places.PlaceDetailsRequest = {
          placeId: placeId,
          fields: ["geometry", "formatted_address", "name", "place_id"],
        };

        try {
          placesService.current!.getDetails(request, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              const locationDetails: LocationDetails = {
                name: place.formatted_address || place.name || "",
                latitude: place.geometry?.location?.lat() || 0,
                longitude: place.geometry?.location?.lng() || 0,
                formatted_address: place.formatted_address || "",
                place_id: place.place_id || placeId,
              };
              resolve(locationDetails);
            } else {
              console.error("Place details error:", status);
              resolve(null);
            }
          });
        } catch (err) {
          console.error("Error getting place details:", err);
          resolve(null);
        }
      });
    },
    [isInitialized]
  );

  // Clear predictions
  const clearPredictions = useCallback((): void => {
    setPredictions([]);
  }, []);

  // Auto-initialize effect
  useEffect(() => {
    if (autoInitialize) {
      initializeGoogleMaps();
    }
  }, [autoInitialize, initializeGoogleMaps]);

  // Execute default query after initialization
  useEffect(() => {
    if (isInitialized && shouldExecuteDefaultQuery.current && defaultQuery) {
      shouldExecuteDefaultQuery.current = false;
      setTimeout(() => {
        searchLocations(defaultQuery);
      }, 100);
    }
  }, [isInitialized, defaultQuery, searchLocations]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    predictions,
    isLoading,
    isInitialized,
    searchLocations,
    getLocationDetails,
    clearPredictions,
    autocompleteService,
    placesService,
    initializeGoogleMaps,
    error,
  };
};