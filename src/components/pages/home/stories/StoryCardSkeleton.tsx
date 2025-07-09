"use client";
import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";
const StoryCardSkeleton = () => {
  return (
    <div className="relative w-full h-[190px] md:h-[210px] rounded-xl overflow-hidden shadow-lg">
      {/* Main content skeleton */}
      <Skeleton
        width="100%"
        height="100%"
        className="rounded-xl"
      />
      {/* Gradient overlay with profile and username */}
      <div className="absolute p-2 md:p-4 rounded-xl top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent">
        <div className="w-full h-full flex flex-col justify-between">
          <Skeleton
            width="40px"
            height="40px"
            className="rounded-full ring-2 ring-primary"
          />
          <Skeleton
            width="80px"
            height="0.875rem"
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default StoryCardSkeleton;