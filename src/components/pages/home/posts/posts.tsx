"use client";
import { useFeedPostsQuery } from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
import PostCard from "./post-card";
import { useState, useEffect } from "react";

const Posts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [seenPostIds, setSeenPostIds] = useState<Set<string>>(new Set()); // Track seen post IDs
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { data: responseData, isLoading, isError } = useFeedPostsQuery(
    [
      { key: "page", value: currentPage },
      { key: "limit", value: 10 },
    ],
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  const postsData = Array.isArray(responseData?.data?.attributes?.results)
    ? (responseData.data.attributes.results as IPost[])
    : [];
  const totalPages = responseData?.data?.attributes?.totalPages;

  // Update posts when new data is fetched
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else if (isError) {
      setLoading(false);
      setHasMore(false);
      console.error("Failed to load posts");
    } else if (postsData.length > 0) {
      // Filter out duplicates using seenPostIds
      const newPosts = postsData.filter((post) => {
        if (!post?._id || seenPostIds.has(post._id)) {
          return false;
        }
        setSeenPostIds((prev) => new Set(prev).add(post._id));
        return true;
      });

      if (newPosts.length > 0) {
        setAllPosts((prev) => [...prev, ...newPosts]);
      }
      setLoading(false);
      setHasMore(currentPage < (totalPages || Infinity));
    } else {
      setHasMore(false);
      setLoading(false);
    }
  }, [postsData, isLoading, isError, currentPage, totalPages, seenPostIds]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoading(true);
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById("sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [loading, hasMore]);

  // Reset state when query parameters change (e.g., filters or sorting)
  // Example: Add dependencies like sortOption or filterOption if applicable
  useEffect(() => {
    setAllPosts([]);
    setSeenPostIds(new Set());
    setCurrentPage(1);
    setHasMore(true);
  }, []); // Add dependencies like sortOption, filterOption if needed

  return (
    <div className="space-y-4">
      {allPosts?.map((post) =>
        post?._id ? <PostCard key={post._id} post={post} /> : null
      )}
      {isError && (
        <div className="text-red-500 text-center py-4">
          Failed to load posts. Please try again.
        </div>
      )}
      {loading && (
        <div
          className="flex justify-center items-center py-4"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Loading more posts...</span>
        </div>
      )}
      <div id="sentinel" style={{ height: "1px" }}></div>
    </div>
  );
};

export default Posts;