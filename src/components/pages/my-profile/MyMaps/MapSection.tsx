"use client";
import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Minus, Plus } from "lucide-react";

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

// Default center (you can adjust this based on your home location)
const defaultCenter: Location = {
  lat: 41.9028, // Example: Rome, Italy
  lng: 12.4964,
};

const MapSection = ({
  mapHide,
  showFullMap,
  setShowFullMap,
}: {
  mapHide: boolean;
  showFullMap: boolean;
  setShowFullMap: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // Replace with your actual Google Maps API key
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Use useJsApiLoader to ensure the Google Maps API is loaded
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  // State to hold the map instance
  const [map, setMap] = useState<google.maps.Map | null>(null);
  // Define locations
  const interestedPlaces: Location[] = [
    { lat: 48.8566, lng: 2.3522 }, // Paris, France
    { lat: 40.7128, lng: -74.006 }, // New York, USA
  ];

  const visitedPlaces: Location[] = [
    { lat: 41.9028, lng: 12.4964 }, // Rome, Italy
    { lat: 51.5074, lng: -0.1278 }, // London, UK
  ];

  const homeLocation: Location = {
    lat: 37.7749, // Example: San Francisco, USA (replace with your home coordinates)
    lng: -122.4194,
  };

  // Custom marker icons (replace these URLs with your own custom icons)
  const customIcons = {
    interested: "https://i.ibb.co.com/BVgNBSG8/interested.png",
    visited: "https://i.ibb.co.com/60gHYs1m/visit.png",
    home: "https://i.ibb.co.com/5xxKK494/home.png",
  };
  // Handle map load
  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  // Zoom in function
  const zoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom()! + 1);
    }
  };

  // Zoom out function
  const zoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom()! - 1);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`w-full  relative px-1 md:px-2  py-2 md:py-4 ${
        mapHide ? "hidden" : showFullMap ? "col-span-full" : ""
      }`}
    >
      <div className="rounded-2xl shadow-md h-full min-h-[600px] overflow-hidden z-20">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={2}
          onLoad={onLoad}
          options={{
            disableDefaultUI: true, // Ensures "Use Ctrl + Scroll to zoom" text is removed
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {/* Markers for places you're interested in */}
          {interestedPlaces.map((place, index) => (
            <Marker
              key={`interested-${index}`}
              position={place}
              icon={{
                url: customIcons.interested,
                scaledSize: new window.google.maps.Size(40, 40), // Use window.google.maps.Size to ensure the API is loaded
              }}
              title="Interested Place"
            />
          ))}

          {/* Markers for places you've visited */}
          {visitedPlaces.map((place, index) => (
            <Marker
              key={`visited-${index}`}
              position={place}
              icon={{
                url: customIcons.visited,
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              title="Visited Place"
            />
          ))}

          {/* Marker for home location */}
          <Marker
            position={homeLocation}
            icon={{
              url: customIcons.home,
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            title="Home"
          />
        </GoogleMap>
      </div>

      {/* Full Map Button */}
      <div className="absolute top-8 left-0 flex  gap-5 items-center">
        <button
          onClick={() => setShowFullMap(!showFullMap)}
          className="bg-[#DEF8F8] text-gray-800 rounded-full size-11 flex items-center justify-center shadow-md hover:bg-gray-100 cursor-pointer z-auto"
        >
          <Plus size={24} />
        </button>
      </div>
      {/* Custom Zoom Buttons */}
      <div className="absolute bottom-16 right-8 flex  gap-5 items-center">
        <button
          onClick={zoomIn}
          className="bg-[#DEF8F8] text-gray-800 rounded-full size-11 flex items-center justify-center shadow-md hover:bg-gray-100 cursor-pointer"
        >
          <Plus size={24} />
        </button>
        <button
          onClick={zoomOut}
          className="bg-[#DEF8F8] text-gray-800 rounded-full size-11 flex items-center justify-center shadow-md hover:bg-gray-100 cursor-pointer"
        >
          <Minus size={24} />
        </button>
      </div>
    </div>
  );
};

export default MapSection;
