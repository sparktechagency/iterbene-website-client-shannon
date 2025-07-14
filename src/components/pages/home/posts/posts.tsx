"use client";
import { useFeedPostsQuery } from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
import PostCard from "./post-card";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import useUser from "@/hooks/useUser";
import PostCardSkeleton from "./PostCardSkeleton";

const Posts = () => {
  const user = useUser();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useFeedPostsQuery(
    [
      { key: "page", value: currentPage.toString() },
      { key: "limit", value: "10" },
      ...(user?._id ? [{ key: "userId", value: user._id }] : []),
    ],
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  // Process fetched posts
  useEffect(() => {
    if (responseData?.data?.attributes?.results) {
      setAllPosts((prevPosts) => {
        // Filter out duplicates based on post ID
        const newPosts = responseData.data.attributes.results.filter(
          (newPost: IPost) =>
            !prevPosts.some((post) => post._id === newPost._id)
        );
        return [...prevPosts, ...newPosts];
      });
      setHasMore(currentPage < responseData.data.attributes.totalPages);
    }
  }, [responseData, currentPage]);

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
  if (isLoading && allPosts.length === 0) {
    return (
      <div className="w-full text-center py-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show "Not available" message if no posts
  if (!isLoading && allPosts.length === 0 && !hasMore) {
    return (
      <section className="w-full text-center py-4">
        <p className="text-gray-600 text-lg">No posts available</p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {allPosts?.map((post: IPost, index: number) => {
        // Attach ref to the last post for infinite scroll
        if (index === allPosts.length - 1) {
          return (
            <div key={post._id} ref={lastPostElementRef}>
              <PostCard post={post} />
            </div>
          );
        }
        return <PostCard key={post._id} post={post} />;
      })}
      {/* Loading indicator for fetching more posts */}
      {isFetching && hasMore && (
        <div className="w-full text-center py-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <PostCardSkeleton key={`fetching-${index}`} />
          ))}
        </div>
      )}
      <div ref={loaderRef} />
    </div>
  );
};

export default Posts;
