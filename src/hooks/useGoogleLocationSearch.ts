import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { loadGoogleMapsApi } from "@/lib/googleMapsLoader";

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

  const [predictions, setPredictions] = useState<LocationPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const initializeServices = useCallback(() => {
    try {
      if (window.google && window.google.maps) {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
        const dummyDiv = document.createElement("div");
        placesService.current = new window.google.maps.places.PlacesService(
          dummyDiv
        );
        setIsInitialized(true);
        return true;
      }
      return false;
    } catch {
      setError("Failed to initialize location services");
      return false;
    }
  }, []);

  const initializeGoogleMaps = useCallback(async () => {
    if (isInitialized) return;

    try {
      await loadGoogleMapsApi(GOOGLE_MAPS_API_KEY);
      if (!initializeServices()) {
        throw new Error("Failed to initialize services after API load");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      toast.error("Failed to initialize location services.");
    }
  }, [isInitialized, initializeServices]);

  const searchLocations = useCallback(
    async (query: string) => {
      const effectiveQuery = query.trim() || defaultQuery?.trim() || "";

      if (!effectiveQuery || effectiveQuery.length < minQueryLength) {
        setPredictions([]);
        return;
      }

      if (!isInitialized) {
        if (autoInitialize) {
          await initializeGoogleMaps();
        }
        return;
      }

      if (!autocompleteService.current) {
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
        };

        autocompleteService.current!.getPlacePredictions(
          request,
          (predictions, status) => {
            setIsLoading(false);

            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              setPredictions(predictions.slice(0, maxResults));
            } else {
              setPredictions([]);
            }
          }
        );
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

  const getLocationDetails = useCallback(
    async (placeId: string): Promise<LocationDetails | null> => {
      if (!isInitialized || !placesService.current) {
        return null;
      }

      return new Promise((resolve) => {
        const request: google.maps.places.PlaceDetailsRequest = {
          placeId: placeId,
          fields: ["geometry", "formatted_address", "name", "place_id"],
        };

        placesService.current!.getDetails(request, (place, status) => {
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
            resolve(null);
          }
        });
      });
    },
    [isInitialized]
  );

  const clearPredictions = useCallback(() => {
    setPredictions([]);
  }, []);

  useEffect(() => {
    if (autoInitialize) {
      initializeGoogleMaps();
    }
  }, [autoInitialize, initializeGoogleMaps]);

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
