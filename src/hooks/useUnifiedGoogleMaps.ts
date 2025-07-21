import { useJsApiLoader } from "@react-google-maps/api";

export const useUnifiedGoogleMaps = () => {
  const GOOGLE_MAPS_API_KEY: string =
    process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "";
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });
  return { isLoaded, loadError };
};
