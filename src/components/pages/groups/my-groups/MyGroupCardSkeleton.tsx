import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";

const MyGroupCardSkeleton = () => {
  return (
    <div className="w-full h-fit bg-white rounded-2xl  p-4 flex flex-col items-center">
      <Skeleton
        width="100%"
        height="200px"
        className="w-full  object-cover rounded-2xl"
      />
      <div className="w-full mt-4">
        <div className="flex flex-col gap-4">
          <Skeleton width="100%" height="3rem" className="rounded-xl" />
          <Skeleton width="100%" height="3rem" className="rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default MyGroupCardSkeleton;
