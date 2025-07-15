"use client";
import { useGetMyMapsQuery } from "@/redux/features/maps/mapsApi";
import { ITripVisitedLocation } from "@/types/trip.types";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// Define the map container style
const mapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

// Define types for location coordinates
interface Location {
  lat: number;
  lng: number;
}

const MapSection = ({
  mapHide,
  showFullMap,
}: {
  mapHide: boolean;
  showFullMap: boolean;
  setShowFullMap: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { data: responseData } = useGetMyMapsQuery(undefined, { refetchOnMountOrArgChange: true });
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "";

  // Only load the libraries you actually need
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: [],
  });

  // Set default center to user's current location from API
  const userCurrentLocation = responseData?.data?.attributes?.userCurrentLocation;
  const defaultCenter: Location = 
    userCurrentLocation &&
    typeof userCurrentLocation.latitude === 'number' &&
    typeof userCurrentLocation.longitude === 'number'
      ? {
          lat: userCurrentLocation.latitude,
          lng: userCurrentLocation.longitude,
        }
      : {
          lat: 40.7128, // Fallback to New York if API data is unavailable or invalid
          lng: -74.006,
        };

  // Get locations from API data
  const interestedPlaces: Location[] = responseData?.data?.attributes?.interestedLocations
    ? responseData.data.attributes.interestedLocations.map((loc: ITripVisitedLocation) => ({
        lat: loc.latitude,
        lng: loc.longitude,
      }))
    : [];

  const visitedPlaces: Location[] = responseData?.data?.attributes?.visitedLocations
    ? responseData.data.attributes.visitedLocations.map((loc: ITripVisitedLocation) => ({
        lat: loc.latitude,
        lng: loc.longitude,
      }))
    : [];

  const homeLocation: Location = defaultCenter;

  // Custom marker icons
  const getCustomIcons = () => {
    if (!window.google || !window.google.maps) return null;

    return {
      interested: {
        url: "https://i.ibb.co.com/BVgNBSG8/interested.png",
        scaledSize: new window.google.maps.Size(40,40),
      },
      visited: {
        url: "https://i.ibb.co.com/60gHYs1m/visit.png",
        scaledSize: new window.google.maps.Size(40,40),
      },
      home: {
        url: "https://i.ibb.co.com/5xxKK494/home.png",
        scaledSize: new window.google.maps.Size(40,40),
      },
    };
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Map...</p>
        </div>
      </div>
    );
  }

  const customIcons = getCustomIcons();

  return (
    <div
      className={`w-full relative px-1 md:px-2 py-2 md:py-4 ${
        mapHide ? "hidden" : showFullMap ? "col-span-full" : ""
      }`}
    >
      <div className="rounded-2xl shadow-md h-full min-h-[200px] md:min-h-[450px] max-h-[720px] overflow-hidden z-20">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={3}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            scrollwheel: true,
            disableDoubleClickZoom: false,
            keyboardShortcuts: false,
            draggable: true,
            clickableIcons: true,
            gestureHandling: "greedy",
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "on" }],
              },
            ],
          }}
        >
          {/* Markers for places you're interested in */}
          {customIcons &&
            interestedPlaces.map((place, index) => (
              <Marker
                key={`interested-${index}`}
                position={place}
                icon={customIcons.interested}
                title={`Interested Place ${index + 1}`}
              />
            ))}

          {/* Markers for places you've visited */}
          {customIcons &&
            visitedPlaces.map((place, index) => (
              <Marker
                key={`visited-${index}`}
                position={place}
                icon={customIcons.visited}
                title={`Visited Place ${index + 1}`}
              />
            ))}

          {/* Marker for home location */}
          {customIcons && (
            <Marker
              position={homeLocation}
              icon={customIcons.home}
              title="Home - Current Location"
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapSection;