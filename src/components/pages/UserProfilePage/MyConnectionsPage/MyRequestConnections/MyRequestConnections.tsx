"use client";
import { useGetConnectionRequestsQuery } from "@/redux/features/connections/connectionsApi";
import { useState, useEffect, useRef, useCallback } from "react";
import { IConnectionRequest } from "@/types/connection.types";
import MyRequestConnectionCard from "./MyRequestConnectionCard";
import MyRequestConnectionSkeleton from "./MyRequestConnectionSkeleton";

const RequestConnections = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [connectionRequests, setConnectionRequests] = useState<IConnectionRequest[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Get connection requests
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetConnectionRequestsQuery([
    { key: "page", value: currentPage.toString() },
    { key: "limit", value: "9" }
  ]);

  // Update connection requests when new data is fetched, ensuring no duplicate _id values
  useEffect(() => {
    const myConnectionRequests = responseData?.data?.attributes?.results || [];
    if (myConnectionRequests?.length > 0) {
      setConnectionRequests((prev) => {
        const existingIds = new Set(prev.map((request) => request._id));
        const newRequests = myConnectionRequests.filter(
          (request: IConnectionRequest) => !existingIds.has(request._id)
        );
        return currentPage === 1 ? newRequests : [...prev, ...newRequests];
      });
      setHasMore(currentPage < (responseData.data.attributes.totalPages || 0));
    }
  }, [responseData, currentPage]);


  // Set up IntersectionObserver for infinite scroll (from Posts)
  const lastRequestElementRef = useCallback(
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
        <MyRequestConnectionSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  let content = null;
  if (isLoading && currentPage === 1) {
    content = renderLoading();
  } else if (connectionRequests.length === 0 && !isLoading) {
    content = (
      <h1 className="text-center text-gray-500 py-8">
        No connection requests available
      </h1>
    );
  } else if (connectionRequests.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {connectionRequests.map((request, index) => {
          // Attach ref to the last connection request for infinite scroll
          if (index === connectionRequests.length - 1) {
            return (
              <div key={request._id} ref={lastRequestElementRef}>
                <MyRequestConnectionCard connection={request} />
              </div>
            );
          }
          return <MyRequestConnectionCard key={request._id} connection={request} />;
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
            <MyRequestConnectionSkeleton key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
};

export default RequestConnections;