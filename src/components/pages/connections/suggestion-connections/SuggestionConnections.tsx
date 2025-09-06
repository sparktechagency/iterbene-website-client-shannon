"use client";
import { useGetSuggestionsConnectionsQuery } from "@/redux/features/connections/connectionsApi";
import { IConnection } from "@/types/connection.types";
import React, { useEffect, useState } from "react";
import SuggestionConnectionsCard from "./SuggestionConnectionsCard";
import SuggestionConnectionsCardSkeleton from "./SuggestionConnectionsCardSkeleton";

const SuggestionConnections: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [allConnections, setAllConnections] = useState<IConnection[]>([]);

  const { data: responseData, isLoading } = useGetSuggestionsConnectionsQuery(
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

  const suggestionsConnections = responseData?.data?.attributes?.results;
  const totalPages = responseData?.data?.attributes?.totalPages;

  useEffect(() => {
    if (suggestionsConnections && suggestionsConnections.length > 0) {
      if (currentPage === 1) {
        // First page - replace all connections
        setAllConnections(suggestionsConnections);
      } else {
        // Additional pages - append only new unique connections
        setAllConnections((prev) => {
          const existingIds = new Set(prev.map((conn) => conn._id));
          const newConnections = suggestionsConnections.filter(
            (conn: IConnection) => !existingIds.has(conn._id)
          );
          return [...prev, ...newConnections];
        });
      }
      setIsLoadingMore(false);
    }
  }, [suggestionsConnections, currentPage]);

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
          No Suggestion Connection found
        </h1>
        <p className="text-xs md:text-sm text-gray-600">
          You don&apos;t have any suggestion connection
        </p>
      </div>
    );
  } else if (allConnections.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {allConnections?.map((connection: IConnection) => (
          <SuggestionConnectionsCard
            key={connection?._id}
            connection={connection}
            onConnectionAction={handleConnectionAction}
          />
        ))}
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6 px-2">
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          People You Might Like
        </h1>
      </div>

      {/* Content Section */}
      {content}

      {/* View More Button */}
      {showViewMoreButton && (
        <div className="w-full flex justify-center my-5">
          <button
            onClick={handleViewMore}
            disabled={isLoadingMore}
            className="px-5 py-1 bg-secondary text-white rounded-lg  cursor-pointer"
          >
            View More
          </button>
        </div>
      )}
    </section>
  );
};

export default SuggestionConnections;
