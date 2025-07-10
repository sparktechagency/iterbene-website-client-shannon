"use client";
import { useGetConnectionRequestsQuery } from "@/redux/features/connections/connectionsApi";
import { IConnectionRequest } from "@/types/connection.types";
import React, { useEffect, useState } from "react";
import RequestedConnectionCard from "./requested-connection-card";
import SuggestionConnectionsCardSkeleton from "../suggestion-connections/SuggestionConnectionsCardSkeleton";

const RequestedConnections: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [allConnectionRequests, setAllConnectionRequests] = useState<
    IConnectionRequest[]
  >([]);

  const { data: responseData, isLoading } = useGetConnectionRequestsQuery(
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

  const connectionsRequestData = responseData?.data?.attributes?.results;
  const requestCount = responseData?.data?.attributes?.requestCount;
  const totalPages = responseData?.data?.attributes?.totalPages;

  useEffect(() => {
    if (connectionsRequestData && connectionsRequestData?.length > 0) {
      if (currentPage === 1) {
        // First page - replace all connection requests
        setAllConnectionRequests(connectionsRequestData);
      } else {
        // Additional pages - append only new unique connection requests
        setAllConnectionRequests((prev) => {
          const existingIds = new Set(prev.map((request) => request._id));
          const newRequests = connectionsRequestData.filter(
            (request: IConnectionRequest) => !existingIds.has(request._id)
          );
          return [...prev, ...newRequests];
        });
      }
      setIsLoadingMore(false);
    }
  }, [connectionsRequestData, currentPage]);

  const handleViewMore = () => {
    if (currentPage < totalPages) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Handle connection accepted/declined - optimistically remove from UI
  const handleConnectionAction = (requestId: string) => {
    setAllConnectionRequests((prev) =>
      prev.filter((request) => request._id !== requestId)
    );
  };

  const hasMoreData = currentPage < totalPages;
  const showViewMoreButton =
    !isLoading && hasMoreData && allConnectionRequests?.length > 0;

  let content = null;
  if (isLoading || isLoadingMore) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SuggestionConnectionsCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  } else if (allConnectionRequests?.length === 0) {
    content = null; // Don't render anything if no requests are found
  } else if (allConnectionRequests?.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allConnectionRequests?.map((request: IConnectionRequest) => (
          <RequestedConnectionCard
            key={request?._id}
            request={request}
            onConnectionAction={handleConnectionAction}
          />
        ))}
      </div>
    );
  }

  // Only render the section if there are requests or loading
  if (!isLoading && !isLoadingMore && allConnectionRequests?.length === 0) {
    return null;
  }

  return (
    <section className="w-full border-b border-gray-400 pb-8">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Requests Connection
          </h1>
          {requestCount > 0 && (
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
              <h1 className="text-sm font-semibold">{requestCount}</h1>
            </div>
          )}
        </div>
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

export default RequestedConnections;
