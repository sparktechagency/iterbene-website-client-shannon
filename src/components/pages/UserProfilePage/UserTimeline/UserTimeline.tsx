"use client";
import { IPost } from "@/types/post.types";
import React, { useState, useEffect } from "react";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useParams } from "next/navigation";
import UserTimelineCard from "./UserTimelineCard";
import UserTimelineSkeletonCard from "./UserTimelineSkeletonCard";
import InfiniteScroll from "react-infinite-scroll-component";

const UserTimeline = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

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
    isError,
  } = useGetUserTimelinePostsQuery(
    {
      username,
      filters: [
        {
          key: "page",
          value: currentPage,
        },
        {
          key: "limit",
          value: 9,
        },
      ],
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !username,
    }
  );

  // Update posts when new data arrives
  useEffect(() => {
    const userTimelineData = responseData?.data?.attributes?.results || [];
    const totalResults = responseData?.data?.attributes?.totalResults || 0;

    if (userTimelineData && !isLoading && !isFetching) {
      if (currentPage === 1) {
        // Reset posts on first page or refetch
        setAllPosts(userTimelineData);
      } else {
        // Append only new posts, avoiding duplicates
        setAllPosts((prev) => {
          const existingIds = new Set(prev.map((post) => post._id));
          const newPosts = userTimelineData.filter(
            (post: IPost) => !existingIds.has(post._id)
          );
          return [...prev, ...newPosts];
        });
      }
      const totalLoadedPosts =
        currentPage === 1
          ? userTimelineData.length
          : allPosts.length + userTimelineData.length;
      setHasMore(
        totalLoadedPosts < totalResults && userTimelineData.length > 0
      );
    }
  }, [responseData, isLoading, isFetching, currentPage, allPosts.length]);

  // Reset when username changes or on initial load
  useEffect(() => {
    if (username) {
      setCurrentPage(1);
      setAllPosts([]);
      setHasMore(true);
    }
  }, [username]);

  const fetchMoreData = () => {
    if (!isLoading && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const refreshData = () => {
    setCurrentPage(1);
    setAllPosts([]);
    setHasMore(true);
  };

  if (isError) {
    return (
      <section className="w-full space-y-3 rounded-2xl">
        <h1 className="text-center text-red-500 py-8">
          Failed to load posts. Please try again.
        </h1>
      </section>
    );
  }

  if (isLoading && currentPage === 1) {
    return (
      <section className="w-full space-y-3 rounded-2xl">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <UserTimelineSkeletonCard key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (!isLoading && allPosts.length === 0) {
    return (
      <section className="w-full space-y-3 rounded-2xl">
        <h1 className="text-center text-gray-500 py-8">No Post available</h1>
      </section>
    );
  }

  return (
    <section className="w-full space-y-3 rounded-2xl">
      <InfiniteScroll
        dataLength={allPosts?.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {Array?.from({ length: 9 }).map((_, index) => (
              <UserTimelineSkeletonCard key={`loading-${index}`} />
            ))}
          </div>
        }
        refreshFunction={refreshData}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: "center" }}>↓ Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: "center" }}>↑ Release to refresh</h3>
        }
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allPosts.map((post: IPost) => (
            <UserTimelineCard key={post._id} post={post} />
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
};

export default UserTimeline;