import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '';

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
  defaultQuery?: string; // Added option for default query
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
}

export const useGoogleLocationSearch = (
  options: UseGoogleLocationSearchOptions = {}
): UseGoogleLocationSearchReturn => {
  const {
    debounceMs = 300,
    minQueryLength = 1,
    maxResults = 20,
    types = ['establishment', 'geocode'],
    autoInitialize = true,
    defaultQuery = '', // Default to empty string
  } = options;

  // States
  const [predictions, setPredictions] = useState<LocationPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize Google Maps API
  const initializeGoogleMaps = useCallback(() => {
    if (window.google?.maps?.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      
      // Create a dummy div for PlacesService
      const dummyDiv = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
      
      setIsInitialized(true);
      return;
    }

    // Load Google Maps API if not loaded
    if (!window.google && !document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google?.maps?.places) {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          
          const dummyDiv = document.createElement('div');
          placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
          
          setIsInitialized(true);
        }
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        toast.error('Failed to load location services');
      };
      document.head.appendChild(script);
    }
  }, []);

  // Auto-initialize on mount
  useEffect(() => {
    if (autoInitialize) {
      initializeGoogleMaps();
    }
  }, [autoInitialize, initializeGoogleMaps]);

  // Search locations function
  const searchLocations = useCallback(async (query: string) => {
    const effectiveQuery = query || defaultQuery; // Use defaultQuery if query is empty
    if (!effectiveQuery || effectiveQuery.length < minQueryLength) {
      setPredictions([]);
      return;
    }

    if (!autocompleteService.current) {
      console.warn('Google Maps AutocompleteService not initialized');
      return;
    }

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce the search
    debounceTimer.current = setTimeout(() => {
      setIsLoading(true);
      
      const request = {
        input: effectiveQuery,
        types: types,
      };

      autocompleteService.current!.getPlacePredictions(
        request,
        (predictions, status) => {
          setIsLoading(false);
          
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            const limitedPredictions = predictions.slice(0, maxResults);
            setPredictions(limitedPredictions);
          } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setPredictions([]);
          } else {
            console.error('Places prediction error:', status);
            setPredictions([]);
          }
        }
      );
    }, debounceMs);
  }, [debounceMs, minQueryLength, maxResults, types, defaultQuery]);

  // Get detailed location information
  const getLocationDetails = useCallback(async (placeId: string): Promise<LocationDetails | null> => {
    if (!placesService.current) {
      console.warn('Google Maps PlacesService not initialized');
      return null;
    }

    return new Promise((resolve) => {
      const request = {
        placeId: placeId,
        fields: ['geometry', 'formatted_address', 'name', 'place_id']
      };

      placesService.current!.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const locationDetails: LocationDetails = {
            name: place.formatted_address || place.name || '',
            latitude: place.geometry?.location?.lat() || 0,
            longitude: place.geometry?.location?.lng() || 0,
            formatted_address: place.formatted_address || '',
            place_id: place.place_id || placeId,
          };
          resolve(locationDetails);
        } else {
          console.error('Place details error:', status);
          resolve(null);
        }
      });
    });
  }, []);

  // Clear predictions
  const clearPredictions = useCallback(() => {
    setPredictions([]);
  }, []);

  // Cleanup on unmount
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
  };
};