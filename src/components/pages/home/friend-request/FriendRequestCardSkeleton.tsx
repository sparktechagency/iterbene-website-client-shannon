"use client";
import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";

const FriendRequestCardSkeleton = () => {
  return (
    <div className="w-full bg-white p-6 rounded-2xl">
      <div className="flex items-center">
        <Skeleton
          width="50px"
          height="50px"
          className="rounded-full ring ring-primary mr-4 flex-shrink-0"
        />
        <div className="flex flex-col">
          <Skeleton width="120px" height="1rem" className="rounded-md" />
          <Skeleton
            width="180px"
            height="1"
            className="rounded-md mt-1"
          />
        </div>
      </div>
      <div className="mt-5 flex justify-between gap-4 items-center">
        <Skeleton width="100%" height="40px" className="rounded-xl" />
        <Skeleton width="100%" height="40px" className="rounded-xl" />
      </div>
    </div>
  );
};

export default FriendRequestCardSkeleton;
