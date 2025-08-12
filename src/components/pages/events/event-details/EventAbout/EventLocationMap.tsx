"use client";
import { IEventDetails } from "@/types/event.types";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React from "react";
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
  // Validate and set groupLocation with fallback
  const groupLocation = {
    lat:
      typeof eventDetailsData?.location?.latitude === "number" &&
      isFinite(eventDetailsData?.location?.latitude)
        ? eventDetailsData?.location?.latitude
        : defaultLocation.lat,
    lng:
      typeof eventDetailsData?.location?.longitude === "number" &&
      isFinite(eventDetailsData?.location?.longitude)
        ? eventDetailsData?.location?.longitude
        : defaultLocation?.lng,
  };

  return (
    <div className="w-full col-span-full md:col-span-5 bg-white p-4 rounded-xl space-y-2">
      <div className="rounded-xl shadow-md h-[350px] overflow-hidden z-20">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ""}
        >
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
            <Marker
              key="groupLocation"
              position={groupLocation}
              title="Group Location"
            />
          </GoogleMap>
        </LoadScript>
      </div>
      <h1 className="text-xl md:text-[22px] text-gray-900 mt-4 font-medium">
        {eventDetailsData?.locationName || "Unknown Location"}
      </h1>
    </div>
  );
};

export default EventLocationMap;
