"use client";
import { useState } from "react";
import MapSection from "./MapSection";
import MyMapHeader from "./MyMapHeader";
import TripList from "./TripList";
import { Switch } from "antd";

const MyMaps = () => {
  const [mapHide, setMapHide] = useState<boolean>(false);
  const [showFullMap, setShowFullMap] = useState<boolean>(false);
  const handleMapHideToggle = () => {
    setMapHide(!mapHide);
    setShowFullMap(false);
  };

  return (
    <div className="w-full bg-white p-3 md:p-5 rounded-2xl">
      <MyMapHeader />
      <div className="w-full flex justify-end mt-4">
        <div className="px-5 py-2.5 border border-[#B5B7C5] rounded-xl font-semibold text-sm flex items-center gap-2 text-gray-900">
          <span>Hide Map</span>{" "}
          <Switch checked={mapHide} onChange={handleMapHideToggle} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-5 ">
        <TripList mapHide={mapHide} showFullMap={showFullMap} />
        <MapSection
          mapHide={mapHide}
          showFullMap={showFullMap}
          setShowFullMap={setShowFullMap}
        />
      </div>
    </div>
  );
};

export default MyMaps;
