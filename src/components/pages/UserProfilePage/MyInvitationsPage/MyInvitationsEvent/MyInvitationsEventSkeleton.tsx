import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";

const MyInvitationsEventSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-2xl p-4 flex flex-col items-center">
      {/* Image Placeholder */}
      <div className="w-full h-[350px] bg-gray-200 rounded-xl mb-4 relative">
        <Skeleton width="100%" height="350px" className="rounded-2xl" />
        <div className="absolute px-4 py-5 rounded-xl top-0 left-0 right-0 bottom-0 ">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <Skeleton width="60px" height="60px" className="rounded-full" />
              <div className="bg-white rounded-full px-4 py-2 flex items-center gap-1">
                <Skeleton width="24px" height="24px" />
                <Skeleton width="40px" height="1rem" />
              </div>
            </div>
            <Skeleton width="80%" height="2rem" className="rounded" />
          </div>
        </div>
      </div>
      {/* Buttons Placeholder */}
      <div className="flex flex-col gap-4 w-full">
        <Skeleton width="100%" height="48px" className="rounded-lg" />
        <Skeleton width="100%" height="48px" className="rounded-lg" />
      </div>
    </div>
  );
};

export default MyInvitationsEventSkeleton;
