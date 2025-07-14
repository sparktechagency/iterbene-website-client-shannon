"use client";
import { IConnection } from "@/types/connection.types";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useGetMyConnectionsQuery } from "@/redux/features/connections/connectionsApi";
import MyConnectionCard from "./MyConnectionCard";
import MyConnectionsSkeleton from "./MyConnectionsSkeleton";

const MyConnections = ({ sortBy }: { sortBy: string }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [connections, setConnections] = useState<IConnection[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyConnectionsQuery([
    { key: "page", value: currentPage.toString() },
    { key: "limit", value: "9" },
    { key: "sortBy", value: sortBy },
  ]);

  // Update connections when new data is fetched, ensuring no duplicate _id values
  useEffect(() => {
    const myAllConnections = responseData?.data?.attributes?.results || [];
    if (myAllConnections.length > 0) {
      setConnections((prev) => {
        const existingIds = new Set(prev.map((connection) => connection._id));
        const newConnections = myAllConnections.filter(
          (connection: IConnection) => !existingIds.has(connection._id)
        );
        if (newConnections.length < myAllConnections.length) {
          console.warn(
            `Filtered out ${
              myAllConnections.length - newConnections.length
            } duplicate connections`
          );
        }
        return currentPage === 1
          ? newConnections
          : [...prev, ...newConnections];
      });
      setHasMore(currentPage < (responseData.data.attributes.totalPages || 0));
    }
  }, [responseData, currentPage]);

  // Reset connections when sortBy changes
  useEffect(() => {
    setConnections([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [sortBy]);

  // Set up IntersectionObserver for infinite scroll (from Posts)
  const lastConnectionElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, hasMore]
  );

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <MyConnectionsSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  let content = null;
  if (isLoading && currentPage === 1) {
    content = renderLoading();
  } else if (connections.length === 0 && !isLoading) {
    content = (
      <h1 className="text-center text-gray-500 py-8">
        No connections available
      </h1>
    );
  } else if (connections.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {connections.map((connection, index) => {
          // Attach ref to the last connection for infinite scroll
          if (index === connections.length - 1) {
            return (
              <div key={connection._id} ref={lastConnectionElementRef}>
                <MyConnectionCard connection={connection} />
              </div>
            );
          }
          return (
            <MyConnectionCard key={connection._id} connection={connection} />
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {content}
      {isFetching && currentPage > 1 && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <MyConnectionsSkeleton key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
};

export default MyConnections;
