"use client";
import { useGetMyInterestedEventsQuery } from "@/redux/features/event/eventApi";
import { useEffect, useRef, useCallback } from "react";
import { IEvent } from "@/types/event.types";
import MyUpComingTourCard from "./MyUpComingTourCard";
import MyUpComingTourSkeleton from "./MyUpComingTourSkeleton";

interface MyUpComingToursProps {
  interestedEvents: IEvent[];
  setInterestedEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyUpComingTours = ({
  interestedEvents,
  setInterestedEvents,
  currentPage,
  setCurrentPage,
  hasMore,
  setHasMore,
}: MyUpComingToursProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Get interested events
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyInterestedEventsQuery([
    { key: "page", value: currentPage.toString() },
    { key: "limit", value: "9" },
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
      setHasMore(currentPage < (responseData.data.attributes.totalPages || 0));
    }
  }, [responseData, currentPage, setInterestedEvents, setHasMore]);

  // Set up IntersectionObserver for infinite scroll
  const lastEventElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, hasMore, setCurrentPage]
  );

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
      {isFetching && currentPage > 1 && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <MyUpComingTourSkeleton key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
};

export default MyUpComingTours;
