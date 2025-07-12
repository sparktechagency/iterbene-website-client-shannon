"use client";
import { useGetConnectionRequestsQuery } from "@/redux/features/connections/connectionsApi";
import { useState, useEffect, useRef } from "react";
import { IConnectionRequest } from "@/types/connection.types";
import MyRequestConnectionCard from "./MyRequestConnectionCard";
import MyRequestConnectionSkeleton from "./MyRequestConnectionSkeleton";

const RequestConnections = ({ sortBy }: { sortBy: string }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [connectionRequests, setConnectionRequests] = useState<
    IConnectionRequest[]
  >([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Get connection requests
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetConnectionRequestsQuery([
    { key: "page", value: currentPage },
    { key: "limit", value: 9 },
    { key: "sortBy", value: sortBy },
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
    }
  }, [responseData, currentPage]);

  // Reset connection requests when sortBy changes
  useEffect(() => {
    setConnectionRequests([]);
    setCurrentPage(1);
  }, [sortBy]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const totalResults = responseData?.data?.attributes?.totalResults || 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          !isFetching &&
          connectionRequests.length < totalResults
        ) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [
    isLoading,
    isFetching,
    connectionRequests.length,
    responseData,
    currentPage,
  ]);

  // const handleItemRemove = (itemId: string) => {
  //   setConnectionRequests((prev) =>
  //     prev.filter((request) => request._id !== itemId)
  //   );
  // };

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
        {connectionRequests?.map((request, index) => (
          <MyRequestConnectionCard
            key={`${request._id}-${index}`}
            connection={request}
          />
        ))}
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
      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default RequestConnections;
