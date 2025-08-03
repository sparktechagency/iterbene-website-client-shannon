"use client";
import { useFeedPostsQuery } from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
import PostCard from "./post-card";
import PostCardSkeleton from "./PostCardSkeleton";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import useUser from "@/hooks/useUser";

const Posts = () => {
  const user = useUser();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

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
        setAllPosts(currentPagePosts);
      } else {
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

  // Force update when RTK Query cache changes (for all pages)
  useEffect(() => {
    if (responseData?.data?.attributes?.results) {
      const freshPosts = responseData.data.attributes.results as IPost[];
      if (freshPosts.length > 0 && allPosts.length > 0) {
        setAllPosts((prevPosts) => {
          return prevPosts.map((existingPost) => {
            const updatedPost = freshPosts.find(
              (p) => p?._id === existingPost?._id
            );
            return updatedPost || existingPost;
          });
        });
      }
    }
  }, [allPosts?.length, responseData?.data?.attributes?.results]);

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

  // Infinite scroll with IntersectionObserver (for sentinel)
  useEffect(() => {
    if (!hasMore || loading) return;

    const observerInstance = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById("sentinel");
    if (sentinel) observerInstance.observe(sentinel);

    return () => {
      if (sentinel) observerInstance.unobserve(sentinel);
    };
  }, [loadMore, loading, hasMore]);

  // Show loading skeletons for initial load
  if (isLoading && allPosts?.length === 0) {
    return (
      <div className="w-full text-center py-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show "Not available" message if no posts
  if (!isLoading && allPosts?.length === 0 && !hasMore) {
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
        if (index === allPosts?.length - 1) {
          return (
            <div key={post?._id} ref={lastPostElementRef}>
              <PostCard post={post} />
            </div>
          );
        }
        return <PostCard key={post?._id} post={post} />;
      })}
      {/* Loading indicator for fetching more posts */}
      {isFetching && hasMore && (
        <div className="w-full text-center py-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <PostCardSkeleton key={`fetching-${index}`} />
          ))}
        </div>
      )}
      <div id="sentinel" style={{ height: "1px" }} />
    </div>
  );
};

export default Posts;
