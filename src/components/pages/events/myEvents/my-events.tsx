"use client";
import { useGetMyEventsQuery } from "@/redux/features/event/eventApi";
import { IEvent } from "@/types/event.types";
import React, { useEffect, useState } from "react";
import MyEventCard from "./my-event-card";
import MyGroupCardSkeleton from "../../groups/my-groups/MyGroupCardSkeleton";

const MyEvents: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [allMyEvents, setAllMyEvents] = useState<IEvent[]>([]);
  const { data: responseData, isLoading } = useGetMyEventsQuery(
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
        // First page - replace all events
        setAllMyEvents(eventsData);
      } else {
        // Additional pages - append only new unique events
        setAllMyEvents((prev) => {
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
    setAllMyEvents((prev) =>
      prev.filter((event) => event._id !== eventId)
    );
  };

  let content = null;
  if (isLoading || isLoadingMore) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <MyGroupCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  } else if (allMyEvents?.length === 0) {
    content = <p className="text-center">No events found</p>;
  } else if (allMyEvents?.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allMyEvents?.map((event: IEvent) => (
          <MyEventCard key={event?._id} event={event} handleOptimisticUiUpdate={handleOptimisticUiUpdate} />
        ))}
      </div>
    );
  }


  // If no data and not loading, return null to hide the component
  if (!isLoading && !isLoadingMore && allMyEvents?.length === 0) {
    return null;
  }

  return (
    <section className="w-full border-b pb-7 border-gray-400 ">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          My Upcoming Events
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

export default MyEvents;
