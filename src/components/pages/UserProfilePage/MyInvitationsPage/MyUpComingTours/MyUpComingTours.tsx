"use client";
import { useGetMyInterestedEventsQuery } from "@/redux/features/event/eventApi";
import { useState, useEffect, useRef } from "react";
import { IEvent } from "@/types/event.types";
import MyUpComingTourCard from "./MyUpComingTourCard";
import MyUpComingTourSkeleton from "./MyUpComingTourSkeleton";

const MyUpComingTours = ({ sortBy }: { sortBy: string }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [interestedEvents, setInterestedEvents] = useState<IEvent[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Get interested events
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyInterestedEventsQuery([
    { key: "page", value: currentPage },
    { key: "limit", value: 9 },
    { key: "sortBy", value: sortBy },
  ]);

  // Update interested events when new data is fetched, ensuring no duplicate _id values
  useEffect(() => {
    const interestedEvent = responseData?.data?.attributes?.results || [];
    if (interestedEvent?.length > 0) {
      setInterestedEvents((prev) => {
        const existingIds = new Set(prev.map((event) => event._id));
        const newEvents = interestedEvent.filter(
          (event: IEvent) => !existingIds.has(event._id)
        );
        return currentPage === 1 ? newEvents : [...prev, ...newEvents];
      });
    }
  }, [responseData, currentPage]);

  // Reset interested events when sortBy changes
  useEffect(() => {
    setInterestedEvents([]);
    setCurrentPage(1);
  }, [sortBy]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const totalResults = responseData?.data?.attributes?.totalResults || 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          !isFetching &&
          interestedEvents.length < totalResults
        ) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoading, isFetching, interestedEvents.length, responseData, currentPage]);

  // const handleItemRemove = (itemId: string) => {
  //   setInterestedEvents((prev) =>
  //     prev.filter((event) => event._id !== itemId)
  //   );
  // };

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <MyUpComingTourSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  let content = null;
  if (isLoading && currentPage === 1) {
    content = renderLoading();
  } else if (interestedEvents.length === 0 && !isLoading) {
    content = (
      <h1 className="text-center text-gray-500 py-8">No events available</h1>
    );
  } else if (interestedEvents.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {interestedEvents?.map((event, index) => (
          <MyUpComingTourCard
            key={`${event._id}-${index}`}
            event={event}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {content}
      {isFetching && currentPage > 1 && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <MyUpComingTourSkeleton key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default MyUpComingTours;