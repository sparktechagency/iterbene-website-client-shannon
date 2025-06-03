"use client";
import { IPost } from "@/types/post.types";
import React, { useState } from "react";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useParams } from "next/navigation";
import UserTimelineCard from "./UserTimelineCard";
import UserTimelineSkeletonCard from "./UserTimelineSkeletonCard";
import InfiniteScrollWrapper from "@/components/custom/InfiniteScrollWrapper";
const UserTimeline = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { userName } = useParams();
  const username =
    typeof userName === "string"
      ? userName
      : Array.isArray(userName)
      ? userName[0]
      : "";

  const {
    data: responseData,
    isLoading,
    isFetching,
    refetch,
  } = useGetUserTimelinePostsQuery(
    {
      username,
      filters: [
        { key: "page", value: currentPage },
        { key: "limit", value: 9 },
      ],
    },
    { refetchOnMountOrArgChange: true, skip: !username }
  );

  const userTimelineData = responseData?.data?.attributes?.results || [];
  const totalResults = responseData?.data?.attributes?.totalResults || 0;

  const fetchMoreData = () => {
    if (!isLoading && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const refreshData = () => {
    setCurrentPage(1);
  };

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <UserTimelineSkeletonCard key={`skeleton-${index}`} />
      ))}
    </div>
  );

  return (
    <InfiniteScrollWrapper<IPost>
      items={userTimelineData}
      isLoading={isLoading && currentPage === 1}
      isFetching={isFetching}
      hasMore={userTimelineData.length + (currentPage - 1) * 9 < totalResults}
      renderItem={(post: IPost) => (
        <UserTimelineCard key={post._id} post={post} refetch={refetch} />
      )}
      renderLoading={renderLoading}
      renderNoData={() => (
        <h1 className="text-center text-gray-500 py-8">No Post available</h1>
      )}
      onFetchMore={fetchMoreData}
      onRefresh={refreshData}
      gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      keyExtractor={(post: IPost) => post._id}
    />
  );
};

export default UserTimeline;
