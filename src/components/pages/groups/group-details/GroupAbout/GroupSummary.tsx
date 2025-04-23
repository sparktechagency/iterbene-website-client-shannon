import React from "react";
import { BsPeople } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LucideUserRound } from "lucide-react";

const GroupSummary = () => {
  return (
    <div className="w-full col-span-full md:col-span-7 bg-white p-8 rounded-xl">
      <div className="w-full space-y-5">
        <div className="flex items-center gap-4">
          <BsPeople className="text-gray-900" size={24} />
          <h1 className="text-base font-medium">1.1k people</h1>
        </div>
        <div className="flex items-center gap-4">
          <LucideUserRound className="text-gray-900" size={24} />
          <h1 className="text-base font-medium mt-1">
            Created by{" "}
            <span className="font-semibold text-lg ">Rakib Islam</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <HiOutlineLocationMarker className="text-gray-900" size={24} />
          <h1 className="text-base font-medium">Dhaka Bangladesh</h1>
        </div>
      </div>
      <h1 className="text-lg mt-7">
        A friendly, like-minded group of explorers who love culture, adventure,
        and making memories. Perfect for solo travelers, friends, or anyone
        looking to experience Barcelona together with ease and fun!
      </h1>
    </div>
  );
};

export default GroupSummary;
