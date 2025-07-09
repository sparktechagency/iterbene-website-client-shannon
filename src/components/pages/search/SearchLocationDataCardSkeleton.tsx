"use client";
import Skeleton from "@/components/custom/custom-skeleton";
import { ChevronRight } from "lucide-react";
import React from "react";

const SearchLocationDataCardSkeleton = () => {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="w-full flex items-center gap-3">
        <Skeleton width="60px" height="60px" className="rounded-xl" />
        <div className="flex flex-col gap-2">
          <Skeleton width="150px" height="1.25rem" className="rounded-md" />
          <Skeleton width="100px" height="0.875rem" className="rounded-md" />
        </div>
      </div>
      <div className="size-12 bg-gray-200 p-2 rounded-full flex justify-center items-center">
        <ChevronRight size={24} className="text-gray-300" />
      </div>
    </div>
  );
};

export default SearchLocationDataCardSkeleton;
