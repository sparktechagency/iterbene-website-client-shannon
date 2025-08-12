// import { useJsApiLoader } from "@react-google-maps/api";

// export const useUnifiedGoogleMaps = () => {
//   const GOOGLE_MAPS_API_KEY: string =
//     process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "";

//   const { isLoaded, loadError } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: GOOGLE_MAPS_API_KEY,
//   });

//   if (!GOOGLE_MAPS_API_KEY) {
//     console.error("Google Maps API key is missing!");
//     return {
//       isLoaded: false,
//       loadError: new Error(
//         "Google Maps API key is not configured. Please check your environment variables."
//       ),
//     };
//   }

//   return { isLoaded, loadError };
// };
