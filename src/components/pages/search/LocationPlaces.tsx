"use client";
import { useGetLocationVisitedPlacesQuery } from "@/redux/features/search/searchApi";
import { IVisitedPlace } from "@/types/search.types";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import LocationPlaceCard from "./LocationPlaceCard";
import LocationPlaceCardSkeleton from "./LocationPlaceCardSkeleton";
import { useAddInterstedLocationMutation } from "@/redux/features/maps/mapsApi";
import { TError } from "@/types/error";
import toast from "react-hot-toast";

const LocationPlaces = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allPlaces, setAllPlaces] = useState<IVisitedPlace[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const locationName = useSearchParams().get("locationName");
  const locationId = useSearchParams().get("locationId");
  const latitude = useSearchParams().get("latitude");
  const longitude = useSearchParams().get("longitude");

  //
  const [addInterstedLocation, { isLoading: isAdding }] =
    useAddInterstedLocationMutation();

  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetLocationVisitedPlacesQuery(
    [
      { key: "locationName", value: locationName },
      { key: "locationId", value: locationId },
      { key: "page", value: currentPage.toString() },
      { key: "limit", value: "9" },
    ],
    {
      refetchOnFocus: true,
      skip: !locationName || !locationId,
    }
  );

  // Append new places to the existing list
  useEffect(() => {
    if (responseData?.data?.attributes?.visitedPlaces) {
      const newPlaces = responseData.data.attributes.visitedPlaces;
      setAllPlaces((prev) => {
        // Avoid duplicates by filtering based on placeId
        const existingIds = new Set(prev.map((place) => place.placeId));
        const uniqueNewPlaces = newPlaces.filter(
          (place: IVisitedPlace) => !existingIds.has(place.placeId)
        );
        return [...prev, ...uniqueNewPlaces];
      });

      // Check if there are more pages to load
      const totalPages = responseData?.data?.attributes?.totalPages || 0;
      setHasMore(currentPage < totalPages);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseData]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const currentObserverRef = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching && !isLoading) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the observer element is visible
    );

    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [hasMore, isFetching, isLoading]);

  const handleInterstedLocation = async () => {
    const payload = {
      latitude: latitude,
      longitude: longitude,
      interestedLocationName: locationName,
    };
    try {
      await addInterstedLocation(payload).unwrap();
      toast.success("Interested visited location added successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <section className="w-full">
      <div className="w-full bg-white px-6 py-5 rounded-2xl flex flex-col md:flex-row gap-5 justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">
          Are you interested to visit {locationName}?
        </h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={handleInterstedLocation}
            disabled={isAdding}
            className="w-36 h-12 bg-secondary text-white rounded-2xl cursor-pointer"
          >
            Yes
          </button>
          <button
            onClick={() =>
              toast.success("Not interested to visit this location!")
            }
            className="w-36 h-12 bg-transparent border border-gray-400 text-gray-800 rounded-2xl cursor-pointer"
          >
            No
          </button>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 md:mt-14">
        {allPlaces?.map((place: IVisitedPlace) => (
          <LocationPlaceCard key={place?.placeId} place={place} />
        ))}
      </div>
      {hasMore && (
        <div ref={observerRef} className="w-full flex justify-center py-4">
          {isFetching || isLoading ? (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <LocationPlaceCardSkeleton />
              <LocationPlaceCardSkeleton />
              <LocationPlaceCardSkeleton />
              <LocationPlaceCardSkeleton />
              <LocationPlaceCardSkeleton />
              <LocationPlaceCardSkeleton />
            </div>
          ) : (
            <p>Scroll to load more</p>
          )}
        </div>
      )}
    </section>
  );
};

export default LocationPlaces;
