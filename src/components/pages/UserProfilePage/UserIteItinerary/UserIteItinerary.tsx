"use client";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import UserIteItineraryCard from "./UserIteItineraryCard";
import UserTimelineSkeletonCard from "../UserTimeline/UserTimelineSkeletonCard";

const UserIteItinerary = () => {
  const { userName } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itineraryPosts, setItineraryPosts] = useState<IPost[]>([]);
  const [removePostIds, setRemovePostIds] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const username =
    typeof userName === "string"
      ? userName
      : Array.isArray(userName)
      ? userName[0]
      : "";

  // Get user itinerary posts
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetUserTimelinePostsQuery(
    {
      username,
      filters: [
        { key: "mediaType", value: "itinerary" },
        { key: "page", value: currentPage.toString() },
        { key: "limit", value: "9" },
      ],
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !username,
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

  // Add new posts to itineraryPosts when currentPage-posts changes
  useEffect(() => {
    if (currentPagePosts?.length > 0) {
      if (currentPage === 1) {
        // Reset posts for first page
        setItineraryPosts(
          currentPagePosts.filter((post) => !removePostIds.includes(post._id))
        );
      } else {
        // Append new posts, avoiding duplicates and removed posts
        setItineraryPosts((prevPosts) => {
          const existingIds = new Set(prevPosts?.map((post) => post?._id));
          const newPosts = currentPagePosts?.filter(
            (post) =>
              !existingIds.has(post._id) && !removePostIds.includes(post._id)
          );
          return [...prevPosts, ...newPosts];
        });
      }
    }
  }, [currentPagePosts, currentPage, removePostIds]);

  // Handle real-time updates: merge updated posts from RTK Query cache
  useEffect(() => {
    if (currentPagePosts?.length > 0 && itineraryPosts?.length > 0) {
      setItineraryPosts((prevPosts) => {
        return prevPosts?.map((existingPost) => {
          const updatedPost = currentPagePosts?.find(
            (p) => p?._id === existingPost?._id
          );
          return updatedPost || existingPost;
        });
      });
    }
  }, [currentPagePosts, itineraryPosts?.length]);

  // Update loading and hasMore states
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
      setHasMore(currentPage < (totalPages || 0));
    }
  }, [isLoading, currentPage, totalPages]);

  // Reset itinerary posts and removed post IDs when username changes
  useEffect(() => {
    setItineraryPosts([]);
    setRemovePostIds([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [username]);

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

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <UserTimelineSkeletonCard key={`skeleton-${index}`} />
      ))}
    </div>
  );

  let content = null;
  if (isLoading && itineraryPosts?.length === 0) {
    content = renderLoading();
  } else if (itineraryPosts.length === 0 && !hasMore) {
    content = (
      <h1 className="text-center text-gray-500 py-8">No itinerary available</h1>
    );
  } else if (itineraryPosts.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {itineraryPosts.map((post, index) => {
          // Attach ref to the last post for infinite scroll
          if (index === itineraryPosts.length - 1) {
            return (
              <div key={post._id} ref={lastPostElementRef}>
                <UserIteItineraryCard
                  post={post}
                  setTimelinePosts={setItineraryPosts}
                />
              </div>
            );
          }
          return (
            <UserIteItineraryCard
              key={post._id}
              post={post}
              setTimelinePosts={setItineraryPosts}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {content}
      {isFetching && hasMore && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <UserTimelineSkeletonCard key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div id="sentinel" style={{ height: "1px" }} />
    </div>
  );
};

export default UserIteItinerary;
