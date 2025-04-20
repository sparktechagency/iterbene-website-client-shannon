'use client';
import { useState } from "react";
import MapSection from "./MapSection";
import MyMapHeader from "./MyMapHeader";
import TripList from "./TripList";

const MyMaps = () => {
  const [mapHide, setMapHide] = useState<boolean>(false);
  const [showFullMap,setShowFullMap] = useState<boolean>(false);

  return (
    <div className="w-full bg-white p-3 md:p-5 rounded-2xl">
      <MyMapHeader mapHide={mapHide} setMapHide={setMapHide} />
      <div className="grid grid-cols-1 md:grid-cols-2 mt-4 ">
        <TripList mapHide={mapHide} showFullMap={showFullMap} />
        <MapSection mapHide={mapHide} showFullMap={showFullMap} setShowFullMap={setShowFullMap} />
      </div>
    </div>
  );
};

export default MyMaps;
