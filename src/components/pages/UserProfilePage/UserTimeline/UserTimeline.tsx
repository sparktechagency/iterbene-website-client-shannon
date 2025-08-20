"use client";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import UserTimelineCard from "./UserTimelineCard";
import UserTimelineSkeletonCard from "./UserTimelineSkeletonCard";
import { useGlobalVideoControl } from "@/hooks/useVideoPlayer";

const UserTimeline = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [timelinePosts, setTimelinePosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { pauseAllVideos } = useGlobalVideoControl();
  const observer = useRef<IntersectionObserver | null>(null);
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

  // Get current page posts from RTK Query cache
  const currentPagePosts = useMemo(
    () =>
      Array.isArray(responseData?.data?.attributes?.results)
        ? (responseData.data.attributes.results as IPost[])
        : [],
    [responseData]
  );

  const totalPages = responseData?.data?.attributes?.totalPages;

  // Add new posts to timelinePosts when currentPagePosts changes
  useEffect(() => {
    if (currentPagePosts?.length > 0) {
      if (currentPage === 1) {
        // Reset posts for first page
        setTimelinePosts(currentPagePosts);
      } else {
        // Append new posts, avoiding duplicates
        setTimelinePosts((prevPosts) => {
          const existingIds = new Set(prevPosts?.map((post) => post?._id));
          const newPosts = currentPagePosts?.filter(
            (post) => !existingIds.has(post._id)
          );
          return [...prevPosts, ...newPosts];
        });
      }
    }
  }, [currentPagePosts, currentPage]);

  // Handle real-time updates: merge updated posts from RTK Query cache
  useEffect(() => {
    if (currentPagePosts?.length > 0 && timelinePosts?.length > 0) {
      setTimelinePosts((prevPosts) => {
        return prevPosts?.map((existingPost) => {
          const updatedPost = currentPagePosts?.find(
            (p) => p?._id === existingPost?._id
          );
          return updatedPost || existingPost;
        });
      });
    }
  }, [currentPagePosts, timelinePosts?.length]);

  // Update loading and hasMore states
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
      setHasMore(currentPage < (totalPages || 0));
    }
  }, [isLoading, currentPage, totalPages]);

  // Reset timeline posts when username changes
  useEffect(() => {
    setTimelinePosts([]);
    setCurrentPage(1);
    setHasMore(true);
    pauseAllVideos();
  }, [username, pauseAllVideos]);

  // Load more posts function
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  // Set up IntersectionObserver for infinite scroll (last post)
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

  // Infinite scroll with IntersectionObserver (for sentinel)
  useEffect(() => {
    if (!hasMore || loading) return;

    const observerInstance = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.11 }
    );

    const sentinel = document.getElementById("sentinel");
    if (sentinel) observerInstance.observe(sentinel);

    return () => {
      if (sentinel) observerInstance.unobserve(sentinel);
    };
  }, [loadMore, loading, hasMore]);

  // Show loading skeletons for initial load
  if (isLoading && timelinePosts?.length === 0) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <UserTimelineSkeletonCard key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Show "Not available" message if no posts
  if (!isLoading && timelinePosts?.length === 0 && !hasMore) {
    return (
      <h1 className="text-center text-gray-500 py-8">No Post available</h1>
    );
  }

  return (
    <div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {timelinePosts?.map((post, index) => {
          // Attach ref to the last post for infinite scroll
          if (index === timelinePosts?.length - 1) {
            return (
              <div key={post?._id} ref={lastPostElementRef}>
                <UserTimelineCard
                  post={post}
                  setTimelinePosts={setTimelinePosts}
                />
              </div>
            );
          }
          return (
            <UserTimelineCard
              key={post?._id}
              post={post}
              setTimelinePosts={setTimelinePosts}
            />
          );
        })}
      </div>
      {isFetching && hasMore && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <UserTimelineSkeletonCard key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div id="sentinel" style={{ height: "1px" }} />
    </div>
  );
};

export default UserTimeline;
