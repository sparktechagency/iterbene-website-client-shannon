"use client";
import { useGetSuggestionsEventsQuery } from "@/redux/features/event/eventApi";
import { IEvent } from "@/types/event.types";
import React, { useEffect, useState } from "react";
import SuggestionEventCard from "./SuggestionEventCard";
import MyGroupCardSkeleton from "../../groups/my-groups/MyGroupCardSkeleton";

const SuggestionEvent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [allSuggestedEvents, setAllSuggestedEvents] = useState<IEvent[]>([]);
  const { data: responseData, isLoading } = useGetSuggestionsEventsQuery(
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
        // First page - replace all suggested events
        setAllSuggestedEvents(eventsData);
      } else {
        // Additional pages - append only new unique suggested events
        setAllSuggestedEvents((prev) => {
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

  // If no data and not loading, return null to hide the component
  if (!isLoading && !isLoadingMore && allSuggestedEvents?.length === 0) {
    return null;
  }

  let content = null;
  if (isLoading || isLoadingMore) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <MyGroupCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  } else if (allSuggestedEvents?.length === 0) {
    content = <p className="text-center">No suggested events found</p>;
  } else if (allSuggestedEvents?.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allSuggestedEvents?.map((event: IEvent) => (
          <SuggestionEventCard key={event?._id} event={event} />
        ))}
      </div>
    );
  }

  return (
    <section className="w-full border-b pb-7 border-gray-400 ">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          You Might Like
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

export default SuggestionEvent;