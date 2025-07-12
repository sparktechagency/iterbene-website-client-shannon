"use client";
import { IConnection } from "@/types/connection.types";
import React, { useState, useEffect, useRef } from "react";
import { useGetMyConnectionsQuery } from "@/redux/features/connections/connectionsApi";
import MyConnectionCard from "./MyConnectionCard";
import MyConnectionsSkeleton from "./MyConnectionsSkeleton";

const MyConnections = ({ sortBy }: { sortBy: string }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [connections, setConnections] = useState<IConnection[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyConnectionsQuery([
    { key: "page", value: currentPage },
    { key: "limit", value: 9 },
    { key: "sortBy", value: sortBy },
  ]);

  // Update connections when new data is fetched, ensuring no duplicate _id values
  useEffect(() => {
    const myAllConnections = responseData?.data?.attributes?.results || [];
    if (myAllConnections?.length > 0) {
      setConnections((prev) => {
        const existingIds = new Set(prev.map((connection) => connection._id));
        const newConnections = myAllConnections.filter(
          (connection: IConnection) => !existingIds.has(connection._id)
        );
        return currentPage === 1
          ? newConnections
          : [...prev, ...newConnections];
      });
    }
  }, [responseData, currentPage]);

  // Reset connections when sortBy changes
  useEffect(() => {
    setConnections([]);
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
          connections.length < totalResults
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
  }, [isLoading, isFetching, connections.length, responseData, currentPage]);

  const handleItemRemove = (itemId: string) => {
    setConnections((prev) =>
      prev.filter((connection) => connection._id !== itemId)
    );
  };

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
        {connections?.map((connection, index) => (
          <MyConnectionCard
            key={`${connection._id}-${index}`}
            connection={connection}
            onRemove={() => handleItemRemove(connection._id)}
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
            <MyConnectionsSkeleton key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default MyConnections;
