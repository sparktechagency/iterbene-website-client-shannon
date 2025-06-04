import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";
import { FiPlayCircle } from "react-icons/fi";

const UserVideoSkeleton = () => {
  return (
    <div className="w-full relative">
      <Skeleton height="20rem" className="rounded-xl" />
      <FiPlayCircle
        size={80}
        strokeWidth={1}
        className="cursor-pointer text-gray-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default UserVideoSkeleton;
