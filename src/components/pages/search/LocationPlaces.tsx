"use client";
import { useGetLocationVisitedPlacesQuery } from "@/redux/features/search/searchApi";
import { IVisitedPlace } from "@/types/search.types";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import LocationPlaceCard from "./LocationPlaceCard";

const LocationPlaces = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const locationName = useSearchParams().get("locationName");
  const locationId = useSearchParams().get("locationId");
  const { data: responseData } = useGetLocationVisitedPlacesQuery(
    [
      {
        key: "locationName",
        value: locationName,
      },
      {
        key: "locationId",
        value: locationId,
      },
      {
        key: "page",
        value: currentPage,
      },
      {
        key: "limit",
        value: 9,
      },
    ],
    {
      refetchOnFocus: true,
      skip: !locationName || !locationId,
    }
  );

  const visitedPlaces = responseData?.data?.attributes?.visitedPlaces;
  console.log("Visited place :", visitedPlaces);
  return (
    <section className="w-full">
      <div className="w-full bg-white px-6 py-5 rounded-2xl flex justify-between items-center">
        <h1 className="text-lg font-semibold  text-gray-800">
          Are you intersted to visit {locationName}?{" "}
        </h1>
        <div className="flex gap-4 items-center">
          <button className="w-36 h-12 bg-secondary text-white rounded-2xl">
            Yes
          </button>
          <button className="w-36 h-12 bg-transparent border border-gray-400 text-gray-800 rounded-2xl">
            No
          </button>
        </div>
      </div>
      <div className="w-full grid grid-cols-3 gap-4">
        {visitedPlaces?.map((place: IVisitedPlace) => (
          <LocationPlaceCard key={place?.placeId} place={place} />
        ))}
      </div>
    </section>
  );
};

export default LocationPlaces;
