"use client";
import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";

const SearchPostDataSkeleton = () => {
  return (
    <section className="w-full h-full max-h-96 bg-white rounded-xl p-4 flex flex-col border border-[#E7E8EC] hover:shadow-xl transition-all duration-300 cursor-pointer">
      <Skeleton height="15rem" className="rounded-xl" />
      <div className="flex flex-col gap-3 justify-between items-start flex-grow mt-5">
        <Skeleton width="80%" height="1rem" className="rounded" />
        <Skeleton width="50%" height="0.5rem" className="rounded" />
        <Skeleton width="50%" height="0.5rem" className="rounded" />
      </div>
    </section>
  );
};

export default SearchPostDataSkeleton;
