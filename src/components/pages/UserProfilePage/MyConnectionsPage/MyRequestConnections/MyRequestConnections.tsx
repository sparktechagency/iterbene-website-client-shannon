"use client";
import { useGetConnectionRequestsQuery } from "@/redux/features/connections/connectionsApi";
import { useState } from "react";
import InfiniteScrollWrapper from "@/components/custom/InfiniteScrollWrapper";
import { IConnectionRequest } from "@/types/connection.types";
import MyRequestConnectionCard from "./MyRequestConnectionCard";
import MyRequestConnectionSkeleton from "./MyRequestConnectionSkeleton";
const RequestConnections = ({ sortBy }: { sortBy: string }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  // get my connections
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetConnectionRequestsQuery([
    { key: "page", value: currentPage },
    { key: "limit", value: 9 },
    { key: "sortBy", value: sortBy },
  ]);

  const connectionsRequestData = responseData?.data?.attributes?.results || [];
  const totalResults = responseData?.data?.attributes?.totalResults || 0;

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
      {Array?.from({ length: 9 }).map((_, index) => (
        <MyRequestConnectionSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  return (
    <InfiniteScrollWrapper<IConnectionRequest>
      items={connectionsRequestData}
      isLoading={isLoading && currentPage === 1}
      isFetching={isFetching}
      hasMore={
        connectionsRequestData?.length + (currentPage - 1) * 9 < totalResults
      }
      renderItem={(request: IConnectionRequest) => (
        <MyRequestConnectionCard key={request?._id} connection={request} />
      )}
      renderLoading={renderLoading}
      renderNoData={() => (
        <h1 className="text-center text-gray-500 py-8">
          No connections request available
        </h1>
      )}
      onFetchMore={fetchMoreData}
      onRefresh={refreshData}
      gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      keyExtractor={(request: IConnectionRequest) => request?._id}
    />
  );
};

export default RequestConnections;
