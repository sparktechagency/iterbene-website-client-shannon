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
  if (isLoading && currentPage === 1) {
    // Initial loading
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SuggestionConnectionsCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  } else if (!isLoading && allConnections.length === 0) {
    content = (
      <p className="text-gray-600 text-center py-8">
        No suggestions users found
      </p>
    );
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

        {/* View More Button */}
        {showViewMoreButton && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleViewMore}
              disabled={isLoadingMore}
              className="bg-primary text-white cursor-pointer font-medium px-6 py-3 rounded-xl transition-colors duration-200 flex items-center gap-2"
            >
              {isLoadingMore ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>View More</>
              )}
            </button>
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
      </div>

      {/* Content Section */}
      {content}
    </section>
  );
};

export default SuggestionConnections;
