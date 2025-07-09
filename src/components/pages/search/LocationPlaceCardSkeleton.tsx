"use client";
import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";
const LocationPlaceCardSkeleton = () => {
  return (
    <div className="w-full h-full max-h-[400px] bg-white rounded-xl p-4 flex flex-col border border-[#E7E8EC] hover:shadow-xl transition-all duration-300">
      {/* Media Section */}
      <div className="relative mb-4">
        <Skeleton width="100%" height="250px" className="rounded-xl" />
      </div>
      {/* Trip Information */}
      <div className="flex gap-3 justify-between items-start flex-grow">
        <div className="space-y-1 flex-grow">
          <div className="flex justify-between items-center gap-3">
            <Skeleton width="70%" height="1.125rem" className="rounded-md" />
            <div className="flex items-center gap-1">
              <Skeleton width="30px" height="1rem" className="rounded-md" />
            </div>
          </div>
          <Skeleton width="100px" height="2rem" className="rounded-xl mt-2" />
        </div>
      </div>
    </div>
  );
};

export default LocationPlaceCardSkeleton;
