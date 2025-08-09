import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";

const UserTimelineSkeletonCard = () => {
  return (
    <div className="w-full flex flex-col bg-white rounded-xl p-4 mb-4 relative">
      {/* Header section */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex gap-3">
          <Skeleton width="60px" height="60px" className="rounded-full" />
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2">
              <Skeleton width="200px" height="1rem" className="rounded" />
              <Skeleton width="30px" height="1rem" className="rounded" />
            </div>
            <div className="flex gap-2">
              <div className="flex gap-2">
                <Skeleton
                  width="0.9rem"
                  height="0.9rem"
                  className="rounded-full"
                />
                <Skeleton
                  width="80px"
                  height="0.9rem"
                  className="rounded-full"
                />
              </div>
              <div className="flex gap-2">
                <Skeleton
                  width="0.9rem"
                  height="0.9rem"
                  className="rounded-full"
                />
                <Skeleton
                  width="80px"
                  height="0.9rem"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
        <Skeleton width="40px" height="0.5rem" />
      </div>
      {/* text content section */}
      <Skeleton height="0.6rem" className="rounded-full mb-3" />
      {/* Content section */}
      <Skeleton height="20rem" className="rounded-xl" />
      <div className="border-y border-[#DDDDDD] py-3 mt-5 flex items-center gap-5">
        <Skeleton width="8%" height="2rem" className="rounded" />
        <Skeleton width="8%" height="2rem" className="rounded" />
        <Skeleton width="8%" height="2rem" className="rounded" />
      </div>
    </div>
  );
};

export default UserTimelineSkeletonCard;
