import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";

const MyInvitationsGroupSkeleton = () => {
  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-xl">
      <div className="flex items-center space-x-4">
        <Skeleton width="60px" height="60px" className="rounded-full" />
        <div className="flex flex-col gap-3">
          <Skeleton width="150px" height="0.5rem" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Skeleton width="15px" height="15px" className="rounded-full" />
              <Skeleton width="60px" height="10px" className="rounded" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton width="15px" height="15px" className="rounded-full" />
              <Skeleton width="60px" height="10px" className="rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInvitationsGroupSkeleton;
