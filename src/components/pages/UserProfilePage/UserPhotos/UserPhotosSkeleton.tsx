import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";

const UserPhotosSkeleton = () => {
  return (
    <div className="w-full relative">
      <Skeleton height="20rem" className="rounded-xl" />
    </div>
  );
};

export default UserPhotosSkeleton;
