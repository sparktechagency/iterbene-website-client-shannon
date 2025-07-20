import { useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect, useRef, useCallback } from "react";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "";

interface UseGoogleLocationSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
  types?: string[];
  defaultQuery?: string;
}

export const GOOGLE_MAPS_LIBRARIES: (
  | "maps"
  | "places"
  | "geometry"
  | "drawing"
  | "visualization"
)[] = ["maps", "places"]; // Include both maps and places

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

export const useUnifiedGoogleMaps = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  useEffect(() => {
    console.log("Google Maps Loaded:", isLoaded, "Load Error:", loadError);
  }, [isLoaded, loadError]);

  return { isLoaded, loadError };
};

export const useGoogleLocationSearch = (
  options: UseGoogleLocationSearchOptions = {}
) => {
  const {
    debounceMs = 300,
    minQueryLength = 1,
    maxResults = 20,
    types = ["establishment", "geocode"],
    defaultQuery = "",
  } = options;

  const { isLoaded } = useUnifiedGoogleMaps();
  const [predictions, setPredictions] = useState<LocationPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const servicesInitialized = useRef(false);

  const initializeServices = useCallback(() => {
    if (isLoaded && !servicesInitialized.current) {
      console.log("Initializing Google Maps services...");
      try {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
        const dummyDiv = document.createElement("div");
        dummyDiv.style.display = "none";
        document.body.appendChild(dummyDiv);
        placesService.current = new window.google.maps.places.PlacesService(
          dummyDiv
        );
        console.log("Services initialized successfully");
        servicesInitialized.current = true;
        setError(null);
        if (defaultQuery && defaultQuery.length >= minQueryLength) {
          setTimeout(() => searchLocations(defaultQuery), 100);
        }
      } catch (err) {
        console.error("Error initializing Google Maps services:", err);
        setError("Failed to initialize location services");
      }
    }
  }, [isLoaded, defaultQuery, minQueryLength]);

  useEffect(() => {
    initializeServices();
  }, [initializeServices]);

  const searchLocations = useCallback(
    async (query: string): Promise<void> => {
      const effectiveQuery = query.trim() || defaultQuery?.trim() || "";
      if (!effectiveQuery || effectiveQuery.length < minQueryLength) {
        setPredictions([]);
        return;
      }
      if (!isLoaded || !autocompleteService.current) {
        console.warn(
          "Google Maps not loaded or AutocompleteService not available"
        );
        setError("Google Maps not loaded or AutocompleteService not available");
        return;
      }

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      setIsLoading(true);
      setError(null);

      debounceTimer.current = setTimeout(() => {
        const request: google.maps.places.AutocompletionRequest = {
          input: effectiveQuery,
          types: types as string[],
          sessionToken: new google.maps.places.AutocompleteSessionToken(), // Add session token
        };

        try {
          autocompleteService.current!.getPlacePredictions(
            request,
            (predictions, status) => {
              setIsLoading(false);
              console.log("Autocomplete Response:", { predictions, status });
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
                if (
                  status ===
                  google.maps.places.PlacesServiceStatus.REQUEST_DENIED
                ) {
                  setError(
                    "Location search access denied. Please check API key permissions."
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
    [defaultQuery, minQueryLength, isLoaded, debounceMs, maxResults, types]
  );

  const getLocationDetails = useCallback(
    async (placeId: string): Promise<LocationDetails | null> => {
      if (!isLoaded || !placesService.current) {
        console.warn("Google Maps not loaded or PlacesService not initialized");
        setError("Google Maps not loaded or PlacesService not initialized");
        return null;
      }

      return new Promise((resolve) => {
        const request: google.maps.places.PlaceDetailsRequest = {
          placeId: placeId,
          fields: ["geometry", "formatted_address", "name", "place_id"],
        };

        try {
          placesService.current!.getDetails(request, (place, status) => {
            console.log("Place Details Response:", { place, status });
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              const locationDetails: LocationDetails = {
                name: place?.name || "",
                latitude: place.geometry?.location?.lat() || 0,
                longitude: place.geometry?.location?.lng() || 0,
                formatted_address: place.formatted_address || "",
                place_id: place.place_id || placeId,
              };
              resolve(locationDetails);
            } else {
              console.error("Place details error:", status);
              setError("Failed to fetch place details");
              resolve(null);
            }
          });
        } catch (err) {
          console.error("Error getting place details:", err);
          setError("Error getting place details");
          resolve(null);
        }
      });
    },
    [isLoaded]
  );

  const clearPredictions = useCallback((): void => {
    setPredictions([]);
  }, []);

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
    searchLocations,
    getLocationDetails,
    clearPredictions,
    error,
  };
};
