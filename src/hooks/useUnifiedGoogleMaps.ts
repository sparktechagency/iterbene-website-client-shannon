import { useJsApiLoader } from "@react-google-maps/api";
import { useMemo } from "react";

export const useUnifiedGoogleMaps = () => {
  const GOOGLE_MAPS_API_KEY: string =
    process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "";

  // Create a memoized error object for missing API key
  const apiKeyError = useMemo(() => 
    !GOOGLE_MAPS_API_KEY ? new Error("Google Maps API key is not configured") : null,
    [GOOGLE_MAPS_API_KEY]
  );

  // Always call the hook, but with conditional configuration
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry"], // Add required libraries for location search
    language: "en", // Keep English as default but maps will work globally
    region: undefined, // Remove region restriction for global access
    preventGoogleFontsLoading: true, // Prevent font loading issues
    version: "3.55", // Specify Maps API version for consistency
  });

  // Handle missing API key after hook call
  if (apiKeyError) {
    console.error("Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAP_API_KEY in your environment variables.");
    return { 
      isLoaded: false, 
      loadError: apiKeyError 
    };
  }
  
  return { isLoaded, loadError };
};
