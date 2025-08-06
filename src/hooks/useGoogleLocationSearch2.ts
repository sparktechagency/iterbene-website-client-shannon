import { useState, useEffect, useRef, useCallback } from "react";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "";

export interface LocationPrediction2 {
  description: string;
  place_id: string;
  main_text: string;
  secondary_text: string;
}

export interface LocationDetails2 {
  name: string;
  latitude: number;
  longitude: number;
  place_id: string;
}

interface UseGoogleLocationSearchOptions2 {
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
  autoInitialize?: boolean;
}

interface UseGoogleLocationSearchReturn2 {
  predictions: LocationPrediction2[];
  isLoading: boolean;
  isInitialized: boolean;
  searchLocations: (query: string) => Promise<void>;
  getLocationDetails: (placeId: string) => Promise<LocationDetails2 | null>;
  clearPredictions: () => void;
  error: string | null;
}

export const useGoogleLocationSearch2 = (
  options: UseGoogleLocationSearchOptions2 = {}
): UseGoogleLocationSearchReturn2 => {
  const { debounceMs = 300, minQueryLength = 1 } = options;

  // States
  const [predictions, setPredictions] = useState<LocationPrediction2[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Check if API key exists
  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setError("Google Maps API key is missing");
      return;
    }
    setIsInitialized(true);
    setError(null);
  }, []);

  // Search using new Places API - Direct fetch
  const searchLocations = useCallback(
    async (query: string): Promise<void> => {
      if (!query || query.length < minQueryLength) {
        setPredictions([]);
        return;
      }

      if (!GOOGLE_MAPS_API_KEY) {
        setError("Google Maps API key is missing");
        return;
      }

      // Clear existing timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      setIsLoading(true);
      setError(null);

      debounceTimer.current = setTimeout(async () => {
        try {
          const response = await fetch(
            "https://places.googleapis.com/v1/places:autocomplete",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
                "X-Goog-FieldMask":
                  "suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.placeId",
              },
              body: JSON.stringify({
                input: query,
                // Note: The new Places API returns up to 5 suggestions by default
                // There is no parameter to increase this limit
                languageCode: "en",
              }),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("API Response:", errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
          }

          const data = await response.json();

          // Transform the response to simplified format
          const transformedPredictions: LocationPrediction2[] =
            data.suggestions?.map(
              (suggestion: {
                placePrediction: {
                  text: { text: string };
                  placeId: string;
                  structuredFormat: {
                    mainText: { text: string };
                    secondaryText?: { text: string };
                  };
                };
              }) => ({
                description: suggestion.placePrediction.text.text,
                place_id: suggestion.placePrediction.placeId,
                main_text:
                  suggestion.placePrediction.structuredFormat.mainText.text,
                secondary_text:
                  suggestion.placePrediction.structuredFormat.secondaryText
                    ?.text || "",
              })
            ) || [];

          setPredictions(transformedPredictions);
        } catch (err) {
          console.error("Search error:", err);
          setError("Location search failed");
          setPredictions([]);
        } finally {
          setIsLoading(false);
        }
      }, debounceMs);
    },
    [minQueryLength, debounceMs]
  );

  // Get place details using new Places API - Direct fetch
  const getLocationDetails = useCallback(
    async (placeId: string): Promise<LocationDetails2 | null> => {
      if (!GOOGLE_MAPS_API_KEY) {
        setError("Google Maps API key is missing");
        return null;
      }

      try {
        const response = await fetch(
          `https://places.googleapis.com/v1/places/${placeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
              "X-Goog-FieldMask": "displayName,location",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Place details API Response:", errorText);
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        return {
          name: data.displayName?.text || "",
          latitude: data.location?.latitude || 0,
          longitude: data.location?.longitude || 0,
          place_id: placeId,
        };
      } catch (err) {
        console.error("Place details error:", err);
        return null;
      }
    },
    []
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
    isInitialized,
    searchLocations,
    getLocationDetails,
    clearPredictions,
    error,
  };
};
