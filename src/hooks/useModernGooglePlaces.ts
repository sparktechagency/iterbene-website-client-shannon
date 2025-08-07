import { useState, useCallback, useRef, useEffect } from 'react';
import { useUnifiedGoogleMaps } from './useUnifiedGoogleMaps';

export interface PlacePrediction {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  primaryText: string;
  secondaryText: string;
  types: string[];
}

export interface PlaceDetails {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  types: string[];
  rating?: number;
  photos?: string[];
}

interface UseModernGooglePlacesOptions {
  debounceMs?: number;
  minQueryLength?: number;
  useNewAPI?: boolean; // Toggle between old and new API
  includedTypes?: string[];
  locationBias?: {
    lat: number;
    lng: number;
    radius?: number;
  };
}

interface UseModernGooglePlacesReturn {
  predictions: PlacePrediction[];
  isLoading: boolean;
  error: string | null;
  searchPlaces: (query: string) => Promise<void>;
  getPlaceDetails: (placeId: string) => Promise<PlaceDetails | null>;
  clearPredictions: () => void;
  isReady: boolean;
}

export const useModernGooglePlaces = (
  options: UseModernGooglePlacesOptions = {}
): UseModernGooglePlacesReturn => {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    useNewAPI = true,
    includedTypes = [],
    locationBias
  } = options;

  // States
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  // Google Maps integration
  const { isLoaded, isPlacesLoaded, apiKey } = useUnifiedGoogleMaps({
    libraries: ['places']
  });

  const isReady = isLoaded && (useNewAPI ? !!apiKey : isPlacesLoaded);

  // Initialize services for old API
  useEffect(() => {
    if (isPlacesLoaded && !useNewAPI && !autocompleteService.current) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      
      // Create dummy div for PlacesService
      const dummyDiv = document.createElement('div');
      dummyDiv.style.display = 'none';
      document.body.appendChild(dummyDiv);
      placesService.current = new google.maps.places.PlacesService(dummyDiv);
    }
  }, [isPlacesLoaded, useNewAPI]);

  // Search using New Places API (Text Search)
  const searchWithNewAPI = useCallback(async (query: string): Promise<void> => {
    if (!apiKey) {
      setError('API key not available');
      return;
    }

    try {
      const requestBody: any = {
        textQuery: query,
        maxResultCount: 5,
        languageCode: 'en'
      };

      // Add location bias if provided
      if (locationBias) {
        requestBody.locationBias = {
          circle: {
            center: {
              latitude: locationBias.lat,
              longitude: locationBias.lng
            },
            radius: locationBias.radius || 10000 // 10km default
          }
        };
      }

      // Add included types if provided
      if (includedTypes.length > 0) {
        requestBody.includedTypes = includedTypes;
      }

      const response = await fetch(
        'https://places.googleapis.com/v1/places:searchText',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.types,places.location'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();

      const transformedPredictions: PlacePrediction[] = data.places?.map((place: any) => ({
        placeId: place.id,
        displayName: place.displayName?.text || '',
        formattedAddress: place.formattedAddress || '',
        primaryText: place.displayName?.text || '',
        secondaryText: place.formattedAddress || '',
        types: place.types || []
      })) || [];

      setPredictions(transformedPredictions);
      setError(null);
    } catch (err) {
      console.error('New Places API search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setPredictions([]);
    }
  }, [apiKey, locationBias, includedTypes]);

  // Search using Old Places API (Autocomplete)
  const searchWithOldAPI = useCallback(async (query: string): Promise<void> => {
    if (!autocompleteService.current) {
      setError('Autocomplete service not available');
      return;
    }

    const request: google.maps.places.AutocompletionRequest = {
      input: query,
      types: ['establishment', 'geocode']
    };

    // Add location bias if provided
    if (locationBias) {
      request.location = new google.maps.LatLng(locationBias.lat, locationBias.lng);
      request.radius = locationBias.radius || 50000; // 50km default
    }

    try {
      autocompleteService.current.getPlacePredictions(
        request,
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            const transformedPredictions: PlacePrediction[] = predictions.map((prediction) => ({
              placeId: prediction.place_id,
              displayName: prediction.description,
              formattedAddress: prediction.description,
              primaryText: prediction.structured_formatting?.main_text || '',
              secondaryText: prediction.structured_formatting?.secondary_text || '',
              types: prediction.types || []
            }));

            setPredictions(transformedPredictions);
            setError(null);
          } else {
            setPredictions([]);
            if (status !== google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              setError('Search failed');
            }
          }
        }
      );
    } catch (err) {
      console.error('Old Places API search error:', err);
      setError('Search failed');
      setPredictions([]);
    }
  }, [locationBias]);

  // Main search function
  const searchPlaces = useCallback(async (query: string): Promise<void> => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery || trimmedQuery.length < minQueryLength) {
      setPredictions([]);
      return;
    }

    if (!isReady) {
      setError('Google Maps not ready');
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
        if (useNewAPI) {
          await searchWithNewAPI(trimmedQuery);
        } else {
          await searchWithOldAPI(trimmedQuery);
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Search failed');
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);
  }, [minQueryLength, isReady, useNewAPI, searchWithNewAPI, searchWithOldAPI, debounceMs]);

  // Get place details with New API
  const getDetailsWithNewAPI = useCallback(async (placeId: string): Promise<PlaceDetails | null> => {
    if (!apiKey) return null;

    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          headers: {
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,types,rating,photos'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const place = await response.json();
      
      return {
        placeId: place.id,
        displayName: place.displayName?.text || '',
        formattedAddress: place.formattedAddress || '',
        location: {
          latitude: place.location?.latitude || 0,
          longitude: place.location?.longitude || 0
        },
        types: place.types || [],
        rating: place.rating,
        photos: place.photos?.map((photo: any) => photo.name) || []
      };
    } catch (err) {
      console.error('New API place details error:', err);
      return null;
    }
  }, [apiKey]);

  // Get place details with Old API
  const getDetailsWithOldAPI = useCallback(async (placeId: string): Promise<PlaceDetails | null> => {
    if (!placesService.current) return null;

    return new Promise((resolve) => {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId,
        fields: ['place_id', 'name', 'formatted_address', 'geometry', 'types', 'rating', 'photos']
      };

      placesService.current!.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve({
            placeId: place.place_id || placeId,
            displayName: place.name || '',
            formattedAddress: place.formatted_address || '',
            location: {
              latitude: place.geometry?.location?.lat() || 0,
              longitude: place.geometry?.location?.lng() || 0
            },
            types: place.types || [],
            rating: place.rating,
            photos: place.photos?.map(photo => photo.getUrl()) || []
          });
        } else {
          resolve(null);
        }
      });
    });
  }, []);

  // Main get details function
  const getPlaceDetails = useCallback(async (placeId: string): Promise<PlaceDetails | null> => {
    if (!isReady) return null;

    try {
      if (useNewAPI) {
        return await getDetailsWithNewAPI(placeId);
      } else {
        return await getDetailsWithOldAPI(placeId);
      }
    } catch (err) {
      console.error('Get place details error:', err);
      return null;
    }
  }, [isReady, useNewAPI, getDetailsWithNewAPI, getDetailsWithOldAPI]);

  // Clear predictions
  const clearPredictions = useCallback(() => {
    setPredictions([]);
    setError(null);
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
    error,
    searchPlaces,
    getPlaceDetails,
    clearPredictions,
    isReady
  };
};