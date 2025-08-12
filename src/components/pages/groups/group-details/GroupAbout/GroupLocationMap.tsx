"use client";
import { IGroupDetails } from "@/types/group.types";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
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

const GroupLocationMap = ({
  groupDetailsData,
}: {
  groupDetailsData: IGroupDetails;
}) => {

  // Validate and set groupLocation with fallback
  const groupLocation = {
    lat:
      typeof groupDetailsData?.location?.latitude === "number" &&
      isFinite(groupDetailsData.location.latitude)
        ? groupDetailsData.location.latitude
        : defaultLocation.lat,
    lng:
      typeof groupDetailsData?.location?.longitude === "number" &&
      isFinite(groupDetailsData.location.longitude)
        ? groupDetailsData.location.longitude
        : defaultLocation.lng,
  };
  return (
    <div className="w-full col-span-full md:col-span-5 bg-white p-4 rounded-xl space-y-2">
      <div className="rounded-xl shadow-md h-[272px] overflow-hidden relative">
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
      <div className="flex items-start space-x-2">
        <span className="text-lg">📍</span>
        <h1 className="text-xl md:text-[22px] text-gray-900 font-medium">
          {groupDetailsData?.locationName || "Unknown Location"}
        </h1>
      </div>
    </div>
  );
};

export default GroupLocationMap;
