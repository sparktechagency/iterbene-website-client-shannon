"use client";
import { useGetMyInvitesQuery } from "@/redux/features/event/eventApi";
import InvitedEventCard from "@/components/pages/events/invited-events/invited-event-card";
import { IEventInvitation } from "@/types/event.types";
import InfiniteScrollWrapper from "@/components/custom/InfiniteScrollWrapper";
import { useState } from "react";
const MyInvitations = ({ sortBy }: { sortBy: string }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyInvitesQuery([
    { key: "page", value: currentPage },
    { key: "limit", value: 9 },
    { key: "sortBy", value: sortBy },
  ]);
  const upComingEvent = responseData?.data?.attributes?.results;
  const totalResults = responseData?.data?.attributes?.totalResults;

  const fetchMoreData = () => {
    if (!isLoading && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const refreshData = () => {
    setCurrentPage(1);
  };

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <h1 key={index}>Loading</h1>
      ))}
    </div>
  );

  return (
    <InfiniteScrollWrapper<IEventInvitation>
      items={upComingEvent}
      isLoading={isLoading && currentPage === 1}
      isFetching={isFetching}
      hasMore={upComingEvent?.length + (currentPage - 1) * 9 < totalResults}
      renderItem={(event: IEventInvitation) => (
        <InvitedEventCard key={event._id} event={event} />
      )}
      renderLoading={renderLoading}
      renderNoData={() => (
        <h1 className="text-center text-gray-500 py-8">
          No invitations event available
        </h1>
      )}
      onFetchMore={fetchMoreData}
      onRefresh={refreshData}
      gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      keyExtractor={(event: IEventInvitation) => event?._id}
    />
  );
};

export default MyInvitations;
