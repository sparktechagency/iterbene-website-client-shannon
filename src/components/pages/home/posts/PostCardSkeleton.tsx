"use client";
import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";

const PostCardSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-2xl p-4 mb-4 relative">
      {/* Post Header Skeleton */}
      <div className="flex justify-between items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
          <Skeleton width="50px" height="50px" className="rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton width="200px" height="15px" className="h-5 rounded-md" />
            <div className="flex items-center gap-2 -ml-1 mt-1">
              <Skeleton width="80px" height="10px" className="h-2 rounded-md" />
              <Skeleton width="80px" height="10px" className="h-4 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Post Content Text Skeleton */}
      <div className="mb-4">
        <Skeleton width="100%" height="16px" className="rounded-md mb-2" />
        <Skeleton width="80%" height="16px" className="rounded-md" />
      </div>

      {/* Post Media Skeleton (Single Media Placeholder) */}
      <div className="w-full mt-3">
        <Skeleton width="100%" height="350px" className="rounded-xl" />
      </div>
      {/* Reactions Summary Skeleton */}
      <div className="mt-5">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton width="30px" height="24px" className="rounded-full" />
          <Skeleton width="30px" height="24px" className="rounded-full" />
          <Skeleton width="50px" height="18px" className="rounded-md" />
        </div>
        <div className="flex gap-7 items-center border-y border-[#DDDDDD] py-3">
          <Skeleton width="80px" height="24px" className="rounded-md" />
          <Skeleton width="60px" height="24px" className="rounded-md" />
          <Skeleton width="60px" height="24px" className="rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
