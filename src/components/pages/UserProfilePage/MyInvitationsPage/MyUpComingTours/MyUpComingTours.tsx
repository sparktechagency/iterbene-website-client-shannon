"use client";

import { useGetMyInterestedEventsQuery } from "@/redux/features/event/eventApi";
import { IEvent } from "@/types/event.types";
import MyUpComingTourCard from "./MyUpComingTourCard";
import { useState } from "react";
import MyJoinedGroupSkeleton from "../../MyGroupsPage/MyJoinedGroups/MyJoinedGroupSkeleton";
import InfiniteScrollWrapper from "@/components/custom/InfiniteScrollWrapper";

const MyUpComingTours = ({ sortBy }: { sortBy: string }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyInterestedEventsQuery([
    { key: "page", value: currentPage },
    { key: "limit", value: 9 },
    { key: "sortBy", value: sortBy },
  ]);
  const interestedEvent = responseData?.data?.attributes?.results;
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
        <MyJoinedGroupSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  return (
    <InfiniteScrollWrapper<IEvent>
      items={interestedEvent}
      isLoading={isLoading && currentPage === 1}
      isFetching={isFetching}
      hasMore={interestedEvent?.length + (currentPage - 1) * 9 < totalResults}
      renderItem={(event: IEvent) => (
        <MyUpComingTourCard key={event._id} event={event} />
      )}
      renderLoading={renderLoading}
      renderNoData={() => (
        <h1 className="text-center text-gray-500 py-8">No events available</h1>
      )}
      onFetchMore={fetchMoreData}
      onRefresh={refreshData}
      gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      keyExtractor={(event: IEvent) => event?._id}
    />
  );
};

export default MyUpComingTours;
