import { useEffect, useState } from "react";

// Global flag to track if the script has been loaded
let isScriptLoaded = false;
let isScriptLoading = false;

interface GoogleMapsHook {
  isLoaded: boolean;
  error: string | null;
}

export const useGoogleMaps = (apiKey: string): GoogleMapsHook => {
  const [isLoaded, setIsLoaded] = useState(isScriptLoaded);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If script is already loaded, update state and exit
    if (isScriptLoaded) {
      setIsLoaded(true);
      return;
    }

    // If script is currently loading, wait for it
    if (isScriptLoading) {
      const checkLoaded = setInterval(() => {
        if (isScriptLoaded) {
          setIsLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 100);
      return () => clearInterval(checkLoaded);
    }

    // Validate API key
    if (!apiKey) {
      console.error(
        "Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAP_API_KEY in your environment variables."
      );
      setError("Google Maps API key is missing");
      return;
    }

    // Check if Google Maps API is already loaded
    if (typeof google !== "undefined" && google.maps && google.maps.places) {
      isScriptLoaded = true;
      setIsLoaded(true);
      return;
    }

    // Check for existing script
    const scriptSrc = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        isScriptLoaded = true;
        setIsLoaded(true);
      });
      existingScript.addEventListener("error", () =>
        setError("Failed to load Google Maps API")
      );
      return;
    }

    // Mark script as loading
    isScriptLoading = true;

    // Create and append script
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.defer = true;
    script.id = "google-maps-script"; // Add ID for easier debugging

    script.onload = () => {
      if (typeof google !== "undefined" && google.maps && google.maps.places) {
        isScriptLoaded = true;
        isScriptLoading = false;
        setIsLoaded(true);
      } else {
        isScriptLoading = false;
        setError("Google Maps API loaded but not initialized correctly");
      }
    };
    script.onerror = () => {
      isScriptLoading = false;
      setError("Failed to load Google Maps API");
    };

    document.body.appendChild(script);

    // Cleanup
    return () => {
      if (!existingScript && document.body.contains(script)) {
        document.body.removeChild(script);
      }
      // Reset loading state if this is the last cleanup
      if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
        isScriptLoading = false;
      }
    };
  }, [apiKey]);

  return { isLoaded, error };
};
