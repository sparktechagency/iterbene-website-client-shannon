import { Switch } from "antd";
import React from "react";

const MyMapHeader = ({
  mapHide,
  handleMapHideToggle,
}: {
  mapHide: boolean;
  handleMapHideToggle: () => void;
}) => {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center border-b border-[#B5B7C5] pb-5">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Travel History
        </h1>
        <div className="px-5 py-2.5 border border-[#B5B7C5] rounded-xl font-semibold text-sm flex items-center gap-2 text-gray-900">
          <span>Hide Map</span>{" "}
          <Switch checked={mapHide} onChange={handleMapHideToggle} />
        </div>
      </div>
    </div>
  );
};

export default MyMapHeader;
