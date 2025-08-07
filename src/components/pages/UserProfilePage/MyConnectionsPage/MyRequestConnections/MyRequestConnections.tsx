"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useGetConnectionRequestsQuery } from "@/redux/features/connections/connectionsApi";
import { IConnectionRequest } from "@/types/connection.types";
import MyRequestConnectionCard from "./MyRequestConnectionCard";
import MyRequestConnectionSkeleton from "./MyRequestConnectionSkeleton";
import useUser from "@/hooks/useUser";

const MyRequestConnections = ({ sortBy = "createdAt" }: { sortBy?: string }) => {
  const user = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [allRequests, setAllRequests] = useState<IConnectionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // API query parameters
  const queryParams = [
    { key: "page", value: currentPage.toString() },
    { key: "limit", value: "12" },
    { key: "sortBy", value: sortBy },
  ];

  const { data: responseData, isLoading: isFetching } =
    useGetConnectionRequestsQuery(queryParams, {
      skip: !user,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  // Get current page connection requests from RTK Query cache
  const currentPageRequests = useMemo(
    () =>
      Array.isArray(responseData?.data?.attributes?.results)
        ? (responseData.data.attributes.results as IConnectionRequest[])
        : [],
    [responseData]
  );

  const totalPages = responseData?.data?.attributes?.totalPages;

  // Add new requests to allRequests when currentPageRequests changes
  useEffect(() => {
    if (currentPageRequests.length > 0) {
      if (currentPage === 1) {
        // Reset requests for first page (handles refreshes/updates)
        setAllRequests(currentPageRequests);
      } else {
        // Append new requests for subsequent pages, avoiding duplicates
        setAllRequests((prevRequests) => {
          const existingIds = new Set(
            prevRequests.map((request) => request?._id)
          );
          const newRequests = currentPageRequests.filter(
            (request) => !existingIds.has(request._id)
          );
          return [...prevRequests, ...newRequests];
        });
      }
    }
  }, [currentPageRequests, currentPage]);

  // Handle real-time updates: merge updated requests from RTK Query cache
  useEffect(() => {
    if (currentPageRequests.length > 0 && allRequests.length > 0) {
      setAllRequests((prevRequests) =>
        prevRequests.map((existingRequest) => {
          const updatedRequest = currentPageRequests.find(
            (p) => p?._id === existingRequest?._id
          );
          return updatedRequest || existingRequest;
        })
      );
    }
  }, [currentPageRequests, allRequests.length]);

  // Reset data when sortBy changes
  useEffect(() => {
    setAllRequests([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [sortBy]);

  // Update loading and hasMore states
  useEffect(() => {
    if (isFetching) {
      setLoading(true);
    } else {
      setLoading(false);
      setHasMore(currentPage < (totalPages || 0));
    }
  }, [isFetching, currentPage, totalPages]);

  // Load more requests function
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

  // Render loading skeleton when no requests are loaded yet
  if (isFetching && allRequests.length === 0) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <MyRequestConnectionSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Show "Not available" message if no requests
  if (!isFetching && allRequests.length === 0) {
    return (
      <section className="w-full text-center py-4">
        <p className="text-gray-600 text-lg">
          No connection requests available
        </p>
      </section>
    );
  }

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {allRequests.map((request) => (
        <MyRequestConnectionCard key={request._id} connection={request} />
      ))}

      {loading && (
        <div
          className="flex justify-center items-center py-4 col-span-full"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="w-8 h-8 border-2 border-primary rounded-full animate-spin"></div>
        </div>
      )}

      {hasMore && <div id="sentinel" style={{ height: "1px" }}></div>}
    </section>
  );
};

export default MyRequestConnections;
