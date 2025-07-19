"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import MyConnectionCard from "./MyConnectionCard";
import MyConnectionsSkeleton from "./MyConnectionsSkeleton";
import { IConnection } from "@/types/connection.types";
import { useGetMyConnectionsQuery } from "@/redux/features/connections/connectionsApi";

const MyConnections = ({ activeTab }: { activeTab: string }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allConnections, setAllConnections] = useState<IConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy] = useState<string>("createdAt");

  // API query parameters
  const queryParams = [
    { key: "page", value: currentPage.toString() },
    { key: "limit", value: "6" },
    { key: "sortBy", value: sortBy },
  ];

  const { data: responseData, isLoading } = useGetMyConnectionsQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      skip: activeTab !== "myConnections",
    }
  );

  // Get current page connections from RTK Query cache
  const currentPageConnections = useMemo(
    () =>
      Array.isArray(responseData?.data?.attributes?.results)
        ? (responseData.data.attributes.results as IConnection[])
        : [],
    [responseData]
  );

  const totalPages = responseData?.data?.attributes?.totalPages;

  // Add new connections to allConnections when currentPageConnections changes
  useEffect(() => {
    if (currentPageConnections.length > 0) {
      if (currentPage === 1) {
        // Reset connections for first page (handles refreshes/updates)
        setAllConnections(currentPageConnections);
      } else {
        // Append new connections for subsequent pages, avoiding duplicates
        setAllConnections((prevConnections) => {
          const existingIds = new Set(
            prevConnections.map((connection) => connection?._id)
          );
          const newConnections = currentPageConnections.filter(
            (connection) => !existingIds.has(connection._id)
          );
          return [...prevConnections, ...newConnections];
        });
      }
    }
  }, [currentPageConnections, currentPage]);

  // Handle real-time updates: merge updated connections from RTK Query cache
  useEffect(() => {
    if (currentPageConnections.length > 0 && allConnections.length > 0) {
      setAllConnections((prevConnections) =>
        prevConnections.map((existingConnection) => {
          const updatedConnection = currentPageConnections.find(
            (p) => p?._id === existingConnection?._id
          );
          return updatedConnection || existingConnection;
        })
      );
    }
  }, [currentPageConnections, allConnections.length]);

  // Update loading and hasMore states
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
      setHasMore(currentPage < (totalPages || 0));
    }
  }, [isLoading, currentPage, totalPages]);

  // Load more connections function
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById("sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [loadMore, loading, hasMore]);

  // Render loading skeleton when no connections are loaded yet
  if (isLoading && allConnections.length === 0) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <MyConnectionsSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Show "Not available" message if no connections
  if (!isLoading && allConnections.length === 0) {
    return (
      <section className="w-full text-center py-4">
        <p className="text-gray-600 text-lg">No connections available</p>
      </section>
    );
  }

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {allConnections.map((connection) => (
        <MyConnectionCard key={connection._id} connection={connection} />
      ))}

      {loading && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <MyConnectionsSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {hasMore && <div id="sentinel" style={{ height: "1px" }}></div>}
    </section>
  );
};

export default MyConnections;
