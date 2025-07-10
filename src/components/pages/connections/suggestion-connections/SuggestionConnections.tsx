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

  const hasMoreData = currentPage < totalPages;
  const showViewMoreButton =
    !isLoading && hasMoreData && allConnections?.length > 0;

  let content = null;
  if (isLoading || isLoadingMore) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SuggestionConnectionsCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  } else if (allConnections.length === 0) {
    content = null; // Don't render anything if no connections are found
  } else if (allConnections.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allConnections.map((connection: IConnection) => (
          <SuggestionConnectionsCard
            key={connection?._id}
            connection={connection}
          />
        ))}
      </div>
    );
  }

  // Only render the section if there are connections or loading
  if (!isLoading && !isLoadingMore && allConnections.length === 0) {
    return null;
  }


  console.log("Has More Data:", hasMoreData);
  return (
    <section className="w-full">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6 px-2">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          People You Might Like
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

export default SuggestionConnections;