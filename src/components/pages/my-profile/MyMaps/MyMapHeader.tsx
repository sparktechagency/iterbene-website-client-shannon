import {  Switch } from "antd";
import { ChevronDown } from "lucide-react";
import React from "react";
import { BiQuestionMark } from "react-icons/bi";
import { RiExpandUpDownLine } from "react-icons/ri";

const MyMapHeader = ({ mapHide, setMapHide } : { mapHide: boolean, setMapHide: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center border-b border-[#B5B7C5] pb-5">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Travel History
        </h1>
        <BiQuestionMark size={25} />
      </div>
      <div className="w-full flex flex-col md:flex-row gap-5 justify-between  items-center mt-5 border-b border-[#B5B7C5] pb-5">
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 border border-[#B5B7C5] rounded-xl font-semibold text-sm flex items-center gap-2 text-gray-900">
            <span>Recently</span> <ChevronDown size={24} className="mt-1" />{" "}
          </button>
          <button className="px-5 py-2.5 border border-[#B5B7C5] rounded-xl font-semibold text-sm flex items-center gap-2 text-gray-900">
            <span>Sort By</span> <RiExpandUpDownLine size={24} />{" "}
          </button>
        </div>
        <button className="px-5 py-2.5 border border-[#B5B7C5] rounded-xl font-semibold text-sm flex items-center gap-2 text-gray-900" >
          Hide Map <Switch checked={mapHide} onChange={() => setMapHide(!mapHide)} />
        </button>
      </div>
    </div>
  );
};

export default MyMapHeader;
