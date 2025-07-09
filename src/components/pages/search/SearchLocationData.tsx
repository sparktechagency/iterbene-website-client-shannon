import { ISearchVisitedLocationDatas } from "@/types/search.types";
import React from "react";
import SearchLocationDataCard from "./SearchLocationDataCard";
import SearchLocationDataCardSkeleton from "./SearchLocationDataCardSkeleton";

const SearchLocationData = ({
  locationsData,
  hasMore,
  isLoading,
  currentPage,
}: {
  locationsData: ISearchVisitedLocationDatas[];
  hasMore: boolean;
  isLoading: boolean;
  currentPage: number;
}) => {
  let content = null;
  if (isLoading && currentPage === 1) {
    content = (
      <section className="w-full flex flex-col gap-4 md:gap-9 mt-6">
        <SearchLocationDataCardSkeleton />
        <SearchLocationDataCardSkeleton />
        <SearchLocationDataCardSkeleton />
        <SearchLocationDataCardSkeleton />
        <SearchLocationDataCardSkeleton />
      </section>
    );
  } else if (locationsData?.length === 0) {
    return (
      <section className="w-full bg-white rounded-xl p-8 text-center">
        <h1 className="text-xl font-semibold text-gray-600">
          No locations available
        </h1>
      </section>
    );
  } else if (locationsData?.length > 0) {
    content = (
      <section className="w-full flex flex-col gap-4 md:gap-9 mt-6">
        {locationsData?.map((locationData: ISearchVisitedLocationDatas) => (
          <SearchLocationDataCard
            key={locationData?.locationId}
            locationData={locationData}
          />
        ))}
      </section>
    );
  }

  return (
    <section className="w-full bg-white rounded-xl p-8">
      {!isLoading && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Location</h1>
            <span className="size-7 bg-primary flex justify-center items-center rounded-full text-white text-base">
              {locationsData.length}
            </span>
          </div>
          {hasMore && (
            <button className="text-primary hover:underline cursor-pointer">
              Show More
            </button>
          )}
        </div>
      )}

      {content}
    </section>
  );
};

export default SearchLocationData;
