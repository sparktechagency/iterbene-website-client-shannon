"use client";
import { useGetMyInterestedEventsQuery } from "@/redux/features/event/eventApi";
import { IEvent } from "@/types/event.types";
import React, { useEffect, useState } from "react";
import InterestedEventCard from "./interested-events-card";
import MyGroupCardSkeleton from "../../groups/my-groups/MyGroupCardSkeleton";

const InterestedEvents: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [allInterestedEvents, setAllInterestedEvents] = useState<IEvent[]>([]);
  const { data: responseData, isLoading } = useGetMyInterestedEventsQuery(
    [
      {
        key: "page",
        value: currentPage,
      },
      {
        key: "limit",
        value: 6,
      },
    ],
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const eventsData = responseData?.data?.attributes?.results;
  const totalPages = responseData?.data?.attributes?.totalPages;

  useEffect(() => {
    if (eventsData && eventsData?.length > 0) {
      if (currentPage === 1) {
        // First page - replace all interested events
        setAllInterestedEvents(eventsData);
      } else {
        // Additional pages - append only new unique interested events
        setAllInterestedEvents((prev) => {
          const existingIds = new Set(prev.map((event) => event._id));
          const newEvents = eventsData.filter(
            (event: IEvent) => !existingIds.has(event._id)
          );
          return [...prev, ...newEvents];
        });
      }
      setIsLoadingMore(false);
    }
  }, [eventsData, currentPage]);

  const handleViewMore = () => {
    if (currentPage < totalPages) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const hasMoreData = currentPage < totalPages;
  const showViewMoreButton =
    !isLoading && hasMoreData && eventsData?.length > 0;

  // optimistic update ui
  const handleOptimisticUiUpdate = (eventId: string) => {
    setAllInterestedEvents((prev) =>
      prev.filter((event) => event._id !== eventId)
    );
  };
  let content = null;
  if (isLoading || isLoadingMore) {
    content = (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <MyGroupCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  } else if (allInterestedEvents?.length === 0) {
    content = null; // Don't render anything if no events are found
  } else if (allInterestedEvents?.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allInterestedEvents?.map((event: IEvent) => (
          <InterestedEventCard key={event?._id} event={event} handleOptimisticUiUpdate={handleOptimisticUiUpdate} />
        ))}
      </div>
    );
  }

  // Only render the section if there are events or loading
  if (!isLoading && !isLoadingMore && allInterestedEvents.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Interested Events
        </h1>
        {showViewMoreButton && (
          <button
            onClick={handleViewMore}
            disabled={isLoadingMore}
            className="text-primary hover:underline cursor-pointer"
          >
            Show more
          </button>
        )}
      </div>

      {/* Content Section */}
      {content}
    </section>
  );
};

export default InterestedEvents;
