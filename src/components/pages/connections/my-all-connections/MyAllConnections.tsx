"use client";
import { useGetMyConnectionsQuery } from "@/redux/features/connections/connectionsApi";
import { IConnection } from "@/types/connection.types";
import React, { useEffect, useState } from "react";
import SuggestionConnectionsCardSkeleton from "../suggestion-connections/SuggestionConnectionsCardSkeleton";
import MyAllConnectionCard from "./MyAllConnectionCard";

const MyAllConnections: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [allConnections, setAllConnections] = useState<IConnection[]>([]);

  const { data: responseData, isLoading } = useGetMyConnectionsQuery(
    [
      {
        key: "page",
        value: currentPage,
      },
      {
        key: "limit",
        value: 8,
      },
    ],
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const myAllConnections = responseData?.data?.attributes?.results;
  const totalPages = responseData?.data?.attributes?.totalPages;

  useEffect(() => {
    if (myAllConnections && myAllConnections.length > 0) {
      if (currentPage === 1) {
        // First page - replace all connections
        setAllConnections(myAllConnections);
      } else {
        // Additional pages - append only new unique connections
        setAllConnections((prev) => {
          const existingIds = new Set(prev.map((conn) => conn._id));
          const newConnections = myAllConnections.filter(
            (conn: IConnection) => !existingIds.has(conn._id)
          );
          return [...prev, ...newConnections];
        });
      }
      setIsLoadingMore(false);
    }
  }, [myAllConnections, currentPage]);

  const handleViewMore = () => {
    if (currentPage < totalPages) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleConnectionAction = (connectionId: string) => {
    setAllConnections((prev) =>
      prev.filter((conn) => conn._id !== connectionId)
    );
  };
  const hasMoreData = currentPage < totalPages;
  const showViewMoreButton =
    !isLoading && hasMoreData && allConnections?.length > 0;

  let content = null;
  if (isLoading || isLoadingMore) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array?.from({ length: 8 }).map((_, index) => (
          <SuggestionConnectionsCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  } else if (allConnections?.length === 0) {
    content = (
      <div className="w-full text-center">
        <h1 className="text-base md:text-lg font-semibold text-gray-700">
          No Connections found
        </h1>
        <p className="text-xs md:text-sm text-gray-600">
          You don&apos;t have any active connections
        </p>
      </div>
    );
  } else if (allConnections.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {allConnections?.map((connection: IConnection) => (
          <MyAllConnectionCard key={connection?._id} connection={connection} handleConnectionAction={handleConnectionAction} />
        ))}
      </div>
    );
  }

  return (
    <section className="w-full border-b border-gray-400 pb-8">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6 px-2">
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          My All Connections
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

export default MyAllConnections;
