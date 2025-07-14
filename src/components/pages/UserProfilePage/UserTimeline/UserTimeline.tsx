"use client";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useState, useEffect, useRef, useCallback } from "react";
import { IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import UserTimelineCard from "./UserTimelineCard";
import UserTimelineSkeletonCard from "./UserTimelineSkeletonCard";

const UserTimeline = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [timelinePosts, setTimelinePosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
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
  } = useGetUserTimelinePostsQuery(
    {
      username,
      filters: [
        { key: "page", value: currentPage.toString() },
        { key: "limit", value: "9" },
      ],
    },
    { refetchOnMountOrArgChange: true, skip: !username }
  );

  // Process fetched posts
  useEffect(() => {
    if (responseData?.data?.attributes?.results) {
      setTimelinePosts((prevPosts) => {
        // Filter out duplicates based on post ID
        const newPosts = responseData.data.attributes.results.filter(
          (newPost: IPost) =>
            !prevPosts.some((post) => post._id === newPost._id)
        );
        return currentPage === 1 ? newPosts : [...prevPosts, ...newPosts];
      });
      setHasMore(currentPage < (responseData.data.attributes.totalPages || 0));
    }
  }, [responseData, currentPage]);

  // Reset timeline posts when username changes
  useEffect(() => {
    setTimelinePosts([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [username]);

  // Set up IntersectionObserver for infinite scroll
  const lastPostElementRef = useCallback(
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

  // Show loading skeletons for initial load
  if (isLoading && timelinePosts.length === 0) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <UserTimelineSkeletonCard key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Show "Not available" message if no posts
  if (!isLoading && timelinePosts.length === 0 && !hasMore) {
    return (
      <h1 className="text-center text-gray-500 py-8">No Post available</h1>
    );
  }

  return (
    <div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {timelinePosts.map((post, index) => {
          // Attach ref to the last post for infinite scroll
          if (index === timelinePosts.length - 1) {
            return (
              <div key={post._id} ref={lastPostElementRef}>
                <UserTimelineCard post={post} />
              </div>
            );
          }
          return <UserTimelineCard key={post._id} post={post} />;
        })}
      </div>
      {isFetching && hasMore && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <UserTimelineSkeletonCard key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
};

export default UserTimeline;
