import { ISearchVisitedLocationDatas } from "@/types/search.types";
import React from "react";
import SearchLocationDataCard from "./SearchLocationDataCard";

const SearchLocationData = ({
  locationsData,
  hasMore,
}: {
  locationsData: ISearchVisitedLocationDatas[];
  hasMore: boolean;
}) => {
  if (!locationsData?.length) {
    return (
      <section className="w-full bg-white rounded-xl p-8 text-center">
        <h1 className="text-xl font-semibold text-gray-600">No locations available</h1>
      </section>
    );
  }

  return (
    <section className="w-full bg-white rounded-xl p-8">
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
      <div className="w-full flex flex-col gap-4 md:gap-9 mt-6">
        {locationsData.map((locationData, index) => (
          <SearchLocationDataCard key={index} locationData={locationData} />
        ))}
      </div>
    </section>
  );
};

export default SearchLocationData;