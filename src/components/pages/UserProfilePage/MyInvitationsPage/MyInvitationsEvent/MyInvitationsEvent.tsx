"use client";
import { useGetMyInvitesQuery } from "@/redux/features/event/eventApi";
import { useState, useEffect, useRef, useCallback } from "react";
import { IEventInvitation } from "@/types/event.types";
import InvitedEventCard from "@/components/pages/events/invited-events/invited-event-card";
import MyInvitationsEventSkeleton from "./MyInvitationsEventSkeleton";

const MyInvitationsEvent = ({ sortBy }: { sortBy: string }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [eventInvitations, setEventInvitations] = useState<IEventInvitation[]>(
    []
  );
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Get event invitations
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyInvitesQuery([
    { key: "page", value: currentPage.toString() },
    { key: "limit", value: "9" },
    { key: "sortBy", value: sortBy },
  ]);

  // Update event invitations when new data is fetched, ensuring no duplicate _id values
  useEffect(() => {
    const upComingEvent = responseData?.data?.attributes?.results || [];
    if (upComingEvent?.length > 0) {
      setEventInvitations((prev) => {
        const existingIds = new Set(prev.map((event) => event._id));
        const newEvents = upComingEvent.filter(
          (event: IEventInvitation) => !existingIds.has(event._id)
        );
        return currentPage === 1 ? newEvents : [...prev, ...newEvents];
      });
      setHasMore(currentPage < (responseData.data.attributes.totalPages || 0));
    }
  }, [responseData, currentPage]);

  // Reset event invitations when sortBy changes
  useEffect(() => {
    setEventInvitations([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [sortBy]);

  // Set up IntersectionObserver for infinite scroll (from Posts)
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
    [isLoading, isFetching, hasMore]
  );

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <MyInvitationsEventSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  let content = null;
  if (isLoading && currentPage === 1) {
    content = renderLoading();
  } else if (eventInvitations.length === 0 && !isLoading) {
    content = (
      <h1 className="text-center text-gray-500 py-8">
        No invitations event available
      </h1>
    );
  } else if (eventInvitations.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {eventInvitations.map((event, index) => {
          // Attach ref to the last event for infinite scroll
          if (index === eventInvitations.length - 1) {
            return (
              <div key={event._id} ref={lastEventElementRef}>
                <InvitedEventCard event={event} />
              </div>
            );
          }
          return <InvitedEventCard key={event._id} event={event} />;
        })}
      </div>
    );
  }

  return (
    <div>
      {content}
      {isFetching && currentPage > 1 && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <MyInvitationsEventSkeleton key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
};

export default MyInvitationsEvent;
