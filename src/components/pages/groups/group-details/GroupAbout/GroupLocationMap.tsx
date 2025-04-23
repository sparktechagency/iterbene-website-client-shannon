"use client";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React from "react";

// Map container style
const mapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

// Group location (Dhaka, Bangladesh)
const groupLocation = {
  lat: 23.8103, // Latitude for Dhaka, Bangladesh
  lng: 90.4125, // Longitude for Dhaka, Bangladesh
};

const GroupLocationMap = () => {
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  // Define custom marker icon only after Google Maps is loaded
  const customMarkerIcon = isLoaded
    ? {
        url: "https://i.ibb.co.com/BVgNBSG8/interested.png",
        scaledSize: new window.google.maps.Size(40, 40),
      }
    : null;

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full col-span-full md:col-span-5 bg-white p-4 rounded-xl space-y-2">
      <div className="rounded-xl shadow-md h-[272px] overflow-hidden z-20">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={groupLocation} // Center the map on Dhaka
          zoom={10} // Adjusted zoom level to focus on the city
          options={{
            zoomControl: false, // Disable zoom controls
            streetViewControl: false, // Disable street view control
            mapTypeControl: false, // Disable map type control
            fullscreenControl: false, // Disable fullscreen control
          }}
        >
          {/* Marker for group location (Dhaka, Bangladesh) with custom image */}
          {customMarkerIcon && (
            <Marker
              key="groupLocation"
              position={groupLocation}
              icon={customMarkerIcon}
              title="Group Location"
            />
          )}
        </GoogleMap>
      </div>
      <h1 className="text-xl md:text-[22px] text-gray-900 mt-4 font-medium">
        Dhaka, Bangladesh
      </h1>
    </div>
  );
};

export default GroupLocationMap;