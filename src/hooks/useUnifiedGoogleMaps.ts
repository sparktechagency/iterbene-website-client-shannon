import { useJsApiLoader } from "@react-google-maps/api";
import { useMemo } from "react";

// Static libraries array to prevent reloading issues
const libraries: ("places" | "geometry")[] = ["places", "geometry"];

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
    libraries: libraries, // Use static libraries array
    language: "en",
    region: undefined,
    preventGoogleFontsLoading: false, // Allow Google Fonts for better map display
    version: "weekly", // Use weekly version instead of deprecated 3.55
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
