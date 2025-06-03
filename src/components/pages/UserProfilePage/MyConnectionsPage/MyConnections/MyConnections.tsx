"use client";
import { useGetMyConnectionsQuery } from "@/redux/features/connections/connectionsApi";
import MyConnectionsSkeleton from "./MyConnectionsSkeleton";
import { useState } from "react";
import InfiniteScrollWrapper from "@/components/custom/InfiniteScrollWrapper";
import { IConnection } from "@/types/connection.types";
import MyConnectionCard from "./MyConnectionCard";
const MyConnections: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // get my connections
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyConnectionsQuery([{ key: "page", value: currentPage }]);

  const myAllConnections = responseData?.data?.attributes?.results || [];
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
      {Array.from({ length: 9 }).map((_, index) => (
        <MyConnectionsSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  return (
    <InfiniteScrollWrapper<IConnection>
      items={myAllConnections}
      isLoading={isLoading && currentPage === 1}
      isFetching={isFetching}
      hasMore={myAllConnections?.length + (currentPage - 1) * 9 < totalResults}
      renderItem={(connection: IConnection) => (
        <MyConnectionCard key={connection?._id} connection={connection} />
      )}
      renderLoading={renderLoading}
      renderNoData={() => (
        <h1 className="text-center text-gray-500 py-8">No connections available</h1>
      )}
      onFetchMore={fetchMoreData}
      onRefresh={refreshData}
      gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      keyExtractor={(connection: IConnection) => connection._id}
    />
  );
};

export default MyConnections;
