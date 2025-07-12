"use client";
import { useGetMyInvitesQuery } from "@/redux/features/event/eventApi";
import { useState, useEffect, useRef } from "react";
import { IEventInvitation } from "@/types/event.types";
import InvitedEventCard from "@/components/pages/events/invited-events/invited-event-card";
import MyInvitationsEventSkeleton from "./MyInvitationsEventSkeleton";

const MyInvitationsEvent = ({ sortBy }: { sortBy: string }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [eventInvitations, setEventInvitations] = useState<IEventInvitation[]>(
    []
  );
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Get event invitations
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyInvitesQuery([
    { key: "page", value: currentPage },
    { key: "limit", value: 9 },
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
    }
  }, [responseData, currentPage]);

  // Reset event invitations when sortBy changes
  useEffect(() => {
    setEventInvitations([]);
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
          eventInvitations.length < totalResults
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
  }, [
    isLoading,
    isFetching,
    eventInvitations.length,
    responseData,
    currentPage,
  ]);

  //   
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
        {eventInvitations?.map((event, index) => (
          <InvitedEventCard
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
            <MyInvitationsEventSkeleton key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default MyInvitationsEvent;
