import { useState, useEffect, useRef, useCallback } from "react";
import { useUnifiedGoogleMaps } from "./useUnifiedGoogleMaps";

export interface LocationPrediction {
  description: string;
  place_id: string;
  main_text: string;
  secondary_text: string;
}

export interface LocationDetails {
  name: string;
  latitude: number;
  longitude: number;
  place_id: string;
  formatted_address: string;
}

interface UseGoogleLocationSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
}

interface UseGoogleLocationSearchReturn {
  predictions: LocationPrediction[];
  isLoading: boolean;
  isInitialized: boolean;
  searchLocations: (query: string) => void;
  getLocationDetails: (placeId: string) => Promise<LocationDetails | null>;
  clearPredictions: () => void;
  error: string | null;
}

export const useGoogleLocationSearchFixed = (
  options: UseGoogleLocationSearchOptions = {}
): UseGoogleLocationSearchReturn => {
  const { debounceMs = 300, minQueryLength = 1 } = options;

  // Use the unified Google Maps loader
  const { isLoaded, loadError } = useUnifiedGoogleMaps();

  // States
  const [predictions, setPredictions] = useState<LocationPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  // Initialize services when Google Maps is loaded
  useEffect(() => {
    if (isLoaded && window.google) {
      try {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        
        // Create a dummy div element for PlacesService (it requires a div)
        const dummyDiv = document.createElement('div');
        placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
        
        setError(null);
      } catch (err) {
        console.error("Error initializing Places services:", err);
        setError("Failed to initialize location services");
      }
    } else if (loadError) {
      setError("Failed to load Google Maps");
    }
  }, [isLoaded, loadError]);

  // Search locations with debounce
  const searchLocations = useCallback(
    (query: string): void => {
      if (!query || query.length < minQueryLength) {
        setPredictions([]);
        return;
      }

      if (!isLoaded || !autocompleteService.current) {
        setError("Location services not ready");
        return;
      }

      // Clear existing timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      setIsLoading(true);
      setError(null);

      debounceTimer.current = setTimeout(() => {
        if (!autocompleteService.current) {
          setIsLoading(false);
          setError("Location services not available");
          return;
        }

        const request: google.maps.places.AutocompletionRequest = {
          input: query,
          types: ['geocode', 'establishment'], // Include both places and addresses
        };

        autocompleteService.current.getPlacePredictions(
          request,
          (predictions, status) => {
            setIsLoading(false);

            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
              const transformedPredictions: LocationPrediction[] = predictions.map(
                (prediction) => ({
                  description: prediction.description,
                  place_id: prediction.place_id,
                  main_text: prediction.structured_formatting?.main_text || prediction.description,
                  secondary_text: prediction.structured_formatting?.secondary_text || "",
                })
              );
              setPredictions(transformedPredictions);
            } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              setPredictions([]);
            } else {
              console.error("Autocomplete error:", status);
              setError("Location search failed");
              setPredictions([]);
            }
          }
        );
      }, debounceMs);
    },
    [isLoaded, minQueryLength, debounceMs]
  );

  // Get place details
  const getLocationDetails = useCallback(
    async (placeId: string): Promise<LocationDetails | null> => {
      if (!isLoaded || !placesService.current) {
        setError("Location services not ready");
        return null;
      }

      return new Promise((resolve) => {
        if (!placesService.current) {
          resolve(null);
          return;
        }

        const request: google.maps.places.PlaceDetailsRequest = {
          placeId: placeId,
          fields: ['name', 'geometry', 'formatted_address', 'place_id'],
        };

        placesService.current.getDetails(request, (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            const location = place.geometry?.location;
            if (location) {
              resolve({
                name: place.name || place.formatted_address || "",
                latitude: location.lat(),
                longitude: location.lng(),
                place_id: placeId,
                formatted_address: place.formatted_address || "",
              });
            } else {
              resolve(null);
            }
          } else {
            console.error("Place details error:", status);
            resolve(null);
          }
        });
      });
    },
    [isLoaded]
  );

  // Clear predictions
  const clearPredictions = useCallback((): void => {
    setPredictions([]);
  }, []);

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
    isInitialized: isLoaded,
    searchLocations,
    getLocationDetails,
    clearPredictions,
    error: error || (loadError ? loadError.message : null),
  };
};