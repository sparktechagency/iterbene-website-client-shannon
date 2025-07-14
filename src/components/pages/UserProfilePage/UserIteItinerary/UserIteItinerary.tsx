"use client";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useState, useEffect, useRef, useCallback } from "react";
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
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Get user itinerary posts
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetUserTimelinePostsQuery(
    {
      username: userName,
      filters: [
        { key: "mediaType", value: "itinerary" },
        { key: "page", value: currentPage.toString() },
        { key: "limit", value: "9" },
      ],
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !userName,
    }
  );

  // Update itinerary posts when new data is fetched, ensuring no duplicate _id values
  useEffect(() => {
    const userItineraryData = responseData?.data?.attributes?.results || [];
    if (userItineraryData?.length > 0) {
      setItineraryPosts((prev) => {
        const existingIds = new Set(prev.map((post) => post._id));
        const newPosts = userItineraryData.filter(
          (post: IPost) =>
            !existingIds.has(post._id) && !removePostIds.includes(post._id)
        );
        return currentPage === 1 ? newPosts : [...prev, ...newPosts];
      });
      setHasMore(currentPage < (responseData.data.attributes.totalPages || 0));
    }
  }, [responseData, currentPage, removePostIds]);

  // Reset itinerary posts and removed post IDs when userName changes
  useEffect(() => {
    setItineraryPosts([]);
    setRemovePostIds([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [userName]);

  // Set up IntersectionObserver for infinite scroll (from Posts)
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

  const handleRemovePost = (postId: string) => {
    setRemovePostIds((prev) => [...prev, postId]);
    setItineraryPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <UserTimelineSkeletonCard key={`skeleton-${index}`} />
      ))}
    </div>
  );

  let content = null;
  if (isLoading && currentPage === 1) {
    content = renderLoading();
  } else if (itineraryPosts.length === 0 && !isLoading) {
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
                  onRemove={() => handleRemovePost(post._id)}
                />
              </div>
            );
          }
          return (
            <UserIteItineraryCard
              key={post._id}
              post={post}
              onRemove={() => handleRemovePost(post._id)}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {content}
      {isFetching && currentPage > 1 && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <UserTimelineSkeletonCard key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div ref={loaderRef} className="h-10" />
    </div>
  );
};

export default UserIteItinerary;
