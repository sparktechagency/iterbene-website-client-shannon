"use client";
import Skeleton from "@/components/custom/custom-skeleton";
import { FaStar } from "react-icons/fa";

const TripCardSkeleton = () => {
  return (
    <div className="w-full h-full max-h-96 bg-white rounded-xl p-4 flex flex-col border border-[#E7E8EC] hover:shadow-xl transition-all duration-300 cursor-pointer">
      {/* Media Section Skeleton */}
      <div className="relative mb-4">
        <Skeleton width="100%" height="250px" className="rounded-xl" />
      </div>
      {/* Trip Information Skeleton */}
      <div className="flex gap-3 justify-between items-start flex-grow">
        <div className="space-y-1 flex-grow">
          <div className="flex justify-between items-center gap-3">
            <Skeleton width="75%" height="1.5rem" />
            <div className="flex items-center gap-1">
              <FaStar className="text-gray-200" />
              <Skeleton width="2rem" height="1rem" />
            </div>
          </div>
          <Skeleton width="50%" height="1rem" />
          <Skeleton width="33%" height="1rem" />
        </div>
      </div>
    </div>
  );
};

export default TripCardSkeleton;
