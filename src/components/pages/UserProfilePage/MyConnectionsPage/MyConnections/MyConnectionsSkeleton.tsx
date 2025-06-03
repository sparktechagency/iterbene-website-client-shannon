import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";

const MyConnectionsSkeleton = () => {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-xl relative">
      {/* Header section */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex gap-3">
          <Skeleton width="60px" height="60px" className="rounded-full" />
          <div className="mt-2">
            <Skeleton width="200px" height="1rem" className="rounded" />
            <Skeleton width="100px" height="0.5rem" className="rounded mt-3" />
          </div>
        </div>
      </div>
      <Skeleton width="40px" height="0.5rem" />
    </div>
  );
};

export default MyConnectionsSkeleton;
