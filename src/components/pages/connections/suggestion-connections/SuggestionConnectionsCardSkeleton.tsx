import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";

const SuggestionConnectionsCardSkeleton = () => {
  return (
    <div className="w-full h-fit bg-white rounded-2xl  p-4 flex flex-col items-center">
      <Skeleton
        width="100%"
        height="230px"
        className="w-full  object-cover rounded-2xl"
      />
      <div className="w-full mt-4">
        <Skeleton width="100%" height="1rem" className="mb-4 rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton width="100%" height="3rem" className="rounded-2xl" />
          <Skeleton width="100%" height="3rem" className="rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default SuggestionConnectionsCardSkeleton;
