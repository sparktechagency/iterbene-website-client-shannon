"use client";
import { useUnifiedGoogleMaps } from "@/hooks/useUnifiedGoogleMaps";
import { IGroupDetails } from "@/types/group.types";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
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
  const { isLoaded, loadError } = useUnifiedGoogleMaps();

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

  // Load Google Maps API

  if (loadError) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-red-50 rounded-2xl">
        <div className="text-center text-red-600 p-4">
          <p className="font-medium">Map loading failed</p>
          <p className="text-sm">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-2xl">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      </div>
    );
  }

  // Define custom marker icon only after Google Maps is loaded
  const customMarkerIcon =
    isLoaded && window.google && window.google.maps
      ? {
          url: "https://iter-bene.s3.eu-north-1.amazonaws.com/basic/interested.png",
          scaledSize: new window.google.maps.Size(40, 40),
          optimized: false,
          anchor: new window.google.maps.Point(20, 40),
        }
      : undefined;

  // Check if we have valid location data
  const hasValidLocation =
    groupDetailsData?.location?.latitude &&
    groupDetailsData?.location?.longitude &&
    isFinite(groupDetailsData.location.latitude) &&
    isFinite(groupDetailsData.location.longitude);

  // Show fallback UI if no valid location
  if (!hasValidLocation) {
    return (
      <div className="w-full col-span-full md:col-span-5 bg-white p-4 rounded-xl space-y-2">
        <div className="rounded-xl shadow-md h-[272px] overflow-hidden flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="text-4xl mb-2">📍</div>
            <p className="text-gray-500">Location data not available</p>
          </div>
        </div>
        <h1 className="text-xl md:text-[22px] text-gray-900 mt-4 font-medium">
          {groupDetailsData?.locationName || "Unknown Location"}
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full col-span-full md:col-span-5 bg-white p-4 rounded-xl space-y-2">
      <div className="rounded-xl shadow-md h-[272px] overflow-hidden relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={groupLocation}
          zoom={13}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            scrollwheel: true,
            disableDoubleClickZoom: false,
            draggable: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          <Marker
            position={groupLocation}
            icon={customMarkerIcon}
            title={groupDetailsData?.locationName || "Group Location"}
            animation={window.google?.maps?.Animation?.DROP}
          />
        </GoogleMap>
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
