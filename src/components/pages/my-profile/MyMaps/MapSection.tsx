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

// Default center (adjusted to center around the new locations, roughly central point)
const defaultCenter: Location = {
  lat: 40.0, // Roughly central latitude for the new locations
  lng: 30.0, // Roughly central longitude for the new locations
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
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  // State to hold the map instance
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Define locations using TripList locations
  const interestedPlaces: Location[] = [
    { lat: 35.0116, lng: 135.7681 }, // Kyoto, Japan
    { lat: 36.3932, lng: 25.4615 },  // Santorini, Greece
  ];

  const visitedPlaces: Location[] = [
    { lat: 51.1784, lng: -115.5708 }, // Banff, Canada
    { lat: 31.6295, lng: -7.9811 },  // Marrakech, Morocco
  ];

  const homeLocation: Location = {
    lat: 34.0522, // Los Angeles, USA (new home location)
    lng: -118.2437,
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
      className={`w-full relative px-1 md:px-2 py-2 md:py-4 ${
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

      {/* Custom Zoom Buttons */}
      <div className="absolute bottom-16 right-8 flex gap-5 items-center">
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