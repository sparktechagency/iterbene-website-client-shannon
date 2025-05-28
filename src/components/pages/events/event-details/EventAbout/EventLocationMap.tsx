"use client";
import { IEventDetails } from "@/types/event.types";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React from "react";

// Map container style
const mapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

// Default location (Dhaka, Bangladesh) as fallback
const defaultLocation = {
  lat: 23.8103, // Latitude for Dhaka
  lng: 90.4125, // Longitude for Dhaka
};

const EventLocationMap = ({
  eventDetailsData,
}: {
  eventDetailsData: IEventDetails;
}) => {
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "";

  // Validate and set groupLocation with fallback
  const groupLocation = {
    lat:
      typeof eventDetailsData?.location?.latitude === "number" &&
        isFinite(eventDetailsData.location.latitude)
        ? eventDetailsData.location.latitude
        : defaultLocation.lat,
    lng:
      typeof eventDetailsData?.location?.longitude === "number" &&
        isFinite(eventDetailsData.location.longitude)
        ? eventDetailsData.location.longitude
        : defaultLocation.lng,
  };

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  // Define custom marker icon only after Google Maps is loaded
  const customMarkerIcon = isLoaded
    ? {
      url: "https://i.ibb.co/BVgNBSG8/interested.png",
      scaledSize: new window.google.maps.Size(40, 40),
    }
    : null;

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Check if location is valid; if not, show fallback UI
  if (!groupLocation.lat || !groupLocation.lng) {
    return (
      <div className="w-full col-span-full md:col-span-5 bg-white p-4 rounded-xl space-y-2">
        <div className="rounded-xl shadow-md h-[272px] overflow-hidden flex items-center justify-center">
          <p className="text-gray-500">Location data not available.</p>
        </div>
        <h1 className="text-xl md:text-[22px] text-gray-900 mt-4 font-medium">
          {eventDetailsData?.locationName || "Unknown Location"}
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full col-span-full md:col-span-5 bg-white p-4 rounded-xl space-y-2">
      <div className="rounded-xl shadow-md h-[272px] overflow-hidden z-20">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={groupLocation}
          zoom={10}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
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
        {eventDetailsData?.locationName || "Unknown Location"}
      </h1>
    </div>
  );
};

export default EventLocationMap;
