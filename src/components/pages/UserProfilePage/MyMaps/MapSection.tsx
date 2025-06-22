"use client";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// Define the map container mx-auto style
const mapcontainer mx-autoStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

// Define types for location coordinates
interface Location {
  lat: number;
  lng: number;
}

// Default center (Dhaka, Bangladesh as shown in your screenshot)
const defaultCenter: Location = {
  lat: 23.8103, // Dhaka latitude
  lng: 90.4125, // Dhaka longitude
};

const MapSection = ({
  mapHide,
  showFullMap,
}: {
  mapHide: boolean;
  showFullMap: boolean;
  setShowFullMap: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // Replace with your actual Google Maps API key
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "";

  // Use useJsApiLoader to ensure the Google Maps API is loaded
  // Only load the libraries you actually need
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: [], // Empty array since you're not using places, geometry, etc.
  });

  // Define locations using TripList locations
  const interestedPlaces: Location[] = [{ lat: 35.0116, lng: 135.7681 }];

  const visitedPlaces: Location[] = [
    { lat: 32.219042, lng: 76.3234037 },
    { lat: 23.7329724, lng: 90.417231 },
  ];

  const homeLocation: Location = {
    lat: 23.8103, // Dhaka, Bangladesh (your current location)
    lng: 90.4125,
  };

  // Custom marker icons - create them only when Google Maps is loaded
  const getCustomIcons = () => {
    if (!window.google || !window.google.maps) return null;

    return {
      interested: {
        url: "https://i.ibb.co.com/BVgNBSG8/interested.png",
        scaledSize: new window.google.maps.Size(40, 40),
      },
      visited: {
        url: "https://i.ibb.co.com/60gHYs1m/visit.png",
        scaledSize: new window.google.maps.Size(40, 40),
      },
      home: {
        url: "https://i.ibb.co.com/5xxKK494/home.png",
        scaledSize: new window.google.maps.Size(40, 40),
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
      className={`w-full relative px-1 md:px-2 py-2 md:py-4 ${mapHide ? "hidden" : showFullMap ? "col-span-full" : ""
        }`}
    >
      <div className="rounded-2xl shadow-md h-full min-h-[600px] overflow-hidden z-20">
        <GoogleMap
          mapcontainer mx-autoStyle={mapcontainer mx-autoStyle}
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
            title="Home - Dhaka, Bangladesh"
          />
        )}
      </GoogleMap>
    </div>
    </div >
  );
};

export default MapSection;
