import { useEffect, useState } from "react";
import { loadGoogleMapsApi } from "@/lib/googleMapsLoader";

interface GoogleMapsHook {
  isLoaded: boolean;
  error: string | null;
}

export const useGoogleMaps = (apiKey: string): GoogleMapsHook => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setError("Google Maps API key is missing");
      return;
    }

    loadGoogleMapsApi(apiKey)
      .then(() => {
        setIsLoaded(true);
      })
      .catch((err) => {
        setError("Failed to load Google Maps API");
        console.error(err);
      });
  }, [apiKey]);

  return { isLoaded, error };
};