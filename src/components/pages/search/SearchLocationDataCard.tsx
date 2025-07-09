"use client";
import { ISearchVisitedLocationDatas } from "@/types/search.types";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const SearchLocationDataCard = ({
  locationData,
}: {
  locationData: ISearchVisitedLocationDatas;
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(
      `/search/posts-locations/location-place?locationName=${locationData?.locationName}&locationId=${locationData?.locationId}&latitude=${locationData?.latitude}&longitude=${locationData?.longitude}`
    );
  };
  return (
    <div className="w-full flex justify-between items-center">
      <div className="w-full flex items-center gap-3">
        <Image
          src={locationData.imageUrl}
          alt={locationData.locationName}
          width={60}
          height={60}
          className="size-[60px] object-cover rounded-xl"
        />
        <div>
          <h1 className="text-lg md:text-xl font-semibold">
            {locationData?.locationName}
          </h1>
          <span>
            {locationData?.visitedPlacesCount} visiting location found
          </span>
        </div>
      </div>
      <button
        onClick={handleClick}
        className="size-12 bg-[#ECFCFA] p-2 rounded-full flex justify-center items-center cursor-pointer"
      >
        <ChevronRight size={24} className="text-gray-700" />
      </button>
    </div>
  );
};

export default SearchLocationDataCard;
