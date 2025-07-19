"use client";
import { IEvent } from "@/types/event.types";
import { useCallback, useRef } from "react";
import MyUpComingTourCard from "./MyUpComingTourCard";
import MyUpComingTourSkeleton from "./MyUpComingTourSkeleton";

interface MyUpComingToursProps {
  interestedEvents: IEvent[];
  setInterestedEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  dataLoaded: boolean;
  setDataLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const MyUpComingTours = ({
  interestedEvents,
  currentPage,
  setCurrentPage,
  hasMore,
  dataLoaded,
  isLoading,
}: MyUpComingToursProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Set up IntersectionObserver for infinite scroll
  const lastEventElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setCurrentPage((prevPage) => prevPage + 1);
          }
        },
        { threshold: 0.1 }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, setCurrentPage]
  );

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <MyUpComingTourSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  let content = null;
  if (isLoading && currentPage === 1 || !dataLoaded) {
    content = renderLoading();
  } else if (interestedEvents.length === 0 && dataLoaded) {
    content = (
      <h1 className="text-center text-gray-500 py-8">No events available</h1>
    );
  } else if (interestedEvents.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {interestedEvents.map((event, index) => {
          // Attach ref to the last event for infinite scroll
          if (index === interestedEvents.length - 1) {
            return (
              <div key={event._id} ref={lastEventElementRef}>
                <MyUpComingTourCard event={event} />
              </div>
            );
          }
          return <MyUpComingTourCard key={event._id} event={event} />;
        })}
      </div>
    );
  }

  return (
    <div>
      {content}
      {isLoading && currentPage > 1 && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3">
          {Array?.from({ length: 3 }).map((_, index) => (
            <MyUpComingTourSkeleton key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
};

export default MyUpComingTours;
