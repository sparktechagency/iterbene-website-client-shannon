"use client";
import { useRef, useCallback } from "react";
import { IEventInvitation } from "@/types/event.types";
import InvitedEventCard from "@/components/pages/events/invited-events/invited-event-card";
import MyInvitationsEventSkeleton from "./MyInvitationsEventSkeleton";

interface MyInvitationsEventProps {
  eventInvitations: IEventInvitation[];
  setEventInvitations: React.Dispatch<React.SetStateAction<IEventInvitation[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  dataLoaded: boolean;
  setDataLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const MyInvitationsEvent = ({
  eventInvitations,
  currentPage,
  setCurrentPage,
  hasMore,
  dataLoaded,
  isLoading
}: MyInvitationsEventProps) => {
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
        <MyInvitationsEventSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  let content = null;
  if (isLoading && currentPage === 1 || !dataLoaded) {
    content = renderLoading();
  } else if (eventInvitations.length === 0 && dataLoaded) {
    content = (
      <h1 className="text-center text-gray-500 py-8">
        No invitations event available
      </h1>
    );
  } else if (eventInvitations.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
      {isLoading && currentPage > 1 && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3">
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
