import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";

const UserProfileSkeleton = () => {
  return (
    <div>
      {/* Profile Header Skeleton */}
      <div className="w-full bg-white rounded-2xl relative mt-[112px]">
        <Skeleton
          width="100%"
          height="360px"
          className="w-full h-[200px] sm:h-[280px] md:h-[360px]  rounded-t-2xl"
        />
        <Skeleton
          width="174px"
          height="174px"
          className="block lg:absolute left-8 size-[174px] mx-auto -mt-[100px] object-cover rounded-full border-4 border-white flex-shrink-0"
        />
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 lg:pl-[240px] p-7 md:p-10 ">
          <div className="space-y-3 flex-1">
            <Skeleton width="200px" height="1rem" className="rounded-md" />
            <div className="flex flex-wrap gap-2 sm:gap-3 text-gray-600 text-sm md:text-base font-medium">
              <Skeleton width="100px" height="1rem" className="rounded-md" />
              <Skeleton width="100px" height="1rem" className="rounded-md" />
              <Skeleton width="100px" height="1rem" className="rounded-md" />
            </div>
          </div>
          <div className="w-full flex gap-7 justify-end flex-1">
            <Skeleton width="200px" height="3rem" className="rounded-xl" />
            <Skeleton width="200px" height="3rem" className="rounded-xl" />
          </div>
        </div>
      </div>
      {/* User Navlinks */}
      <div className="bg-gray-100  border-gray-200 overflow-x-auto scrollbar-thin mt-8">
        <div className="flex space-x-6 px-4 py-2">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton
              key={index}
              width="100px"
              height="1rem"
              className="rounded-md"
            />
          ))}
        </div>
      </div>
      {/* User Details */}
      <div className="w-full bg-white space-y-[32px] p-6 mt-10 rounded-2xl">
        {[...Array(13)].map((_, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-1 md:gap-20">
            <Skeleton width="250px" height="1rem" className="w-full md:w-96 rounded-md" />
            <Skeleton width="200px" height="1rem" className="w-full md:w-96 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfileSkeleton;
