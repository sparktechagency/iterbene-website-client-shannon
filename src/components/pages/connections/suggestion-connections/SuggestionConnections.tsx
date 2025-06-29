"use client";
import { useGetSuggestionsConnectionsQuery } from "@/redux/features/connections/connectionsApi";
import { IConnection } from "@/types/connection.types";
import SuggestionConnectionsCard from "./SuggestionConnectionsCard";
import SuggestionConnectionsCardSkeleton from "./SuggestionConnectionsCardSkeleton";
import { useState, useEffect } from "react";

const SuggestionConnections = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allConnections, setAllConnections] = useState<IConnection[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data: responseData, isLoading } = useGetSuggestionsConnectionsQuery([
    {
      key: "page",
      value: currentPage,
    },
    {
      key: "limit",
      value: 8,
    },
  ]);

  const suggestionsConnections = responseData?.data?.attributes?.results;
  const totalPages = responseData?.data?.attributes?.totalPages;

  // Update allConnections when new data arrives
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
    !isLoading && hasMoreData && allConnections.length > 0;

  let content = null;
  if (isLoading || isLoadingMore) {
    // Initial loading
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SuggestionConnectionsCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  } else if (!isLoading && allConnections.length === 0) {
    content = <p className="text-center py-8">No suggestions users found</p>;
  } else if (allConnections.length > 0) {
    content = (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {allConnections.map((connection: IConnection) => (
            <SuggestionConnectionsCard
              key={connection?._id}
              connection={connection}
            />
          ))}
        </div>

        {/* Loading more skeletons */}
        {isLoadingMore && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <SuggestionConnectionsCardSkeleton
                key={`loading-more-${index}`}
              />
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <section>
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-5 px-2">
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
