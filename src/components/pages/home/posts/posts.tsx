"use client";
import { useFeedPostsQuery } from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
import PostCard from "./post-card";
import { useState, useEffect, useMemo, useCallback } from "react";
import useUser from "@/hooks/useUser";
import PostCardSkeleton from "./PostCardSkeleton";

const Posts = () => {
  const user = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { data: responseData, isLoading } = useFeedPostsQuery(
    [
      { key: "page", value: currentPage },
      { key: "limit", value: 10 },
      ...(user?._id ? [{ key: "userId", value: user._id }] : []),
    ],
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
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

  // Add new posts to allPosts when currentPagePosts changes
  useEffect(() => {
    if (currentPagePosts?.length > 0) {
      if (currentPage === 1) {
        // Reset posts for first page (handles refreshes/updates)
        setAllPosts(currentPagePosts);
      } else {
        // Append new posts for subsequent pages, avoiding duplicates
        setAllPosts((prevPosts) => {
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
    if (currentPagePosts?.length > 0 && allPosts?.length > 0) {
      // Update existing posts with fresh data from current page
      setAllPosts((prevPosts) => {
        return prevPosts?.map((existingPost) => {
          const updatedPost = currentPagePosts?.find(
            (p) => p?._id === existingPost?._id
          );
          return updatedPost || existingPost;
        });
      });
    }
  }, [allPosts?.length, currentPagePosts]);

  // Update loading and hasMore states
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
      setHasMore(currentPage < (totalPages || 0));
    }
  }, [isLoading, currentPage, totalPages]);

  // Load more posts function
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

  if (isLoading) {
    return (
      <div className="w-full text-center py-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  // Show "Not available" message if no posts
  if (!isLoading && allPosts?.length === 0) {
    return (
      <section className="w-full text-center py-4">
        <p className="text-gray-600 text-lg">Not posts available</p>
      </section>
    );
  }
  return (
    <div className="space-y-4">
      {allPosts?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {loading && (
        <div
          className="flex justify-center items-center py-4"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="w-8 h-8 border-2 border-primary rounded-full animate-spin"></div>
        </div>
      )}

      {hasMore && <div id="sentinel" style={{ height: "1px" }}></div>}
    </div>
  );
};

export default Posts;
