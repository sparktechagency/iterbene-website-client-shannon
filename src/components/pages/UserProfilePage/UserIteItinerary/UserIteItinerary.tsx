"use client";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useState, useEffect, useRef } from "react";
import { IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import UserIteItineraryCard from "./UserIteItineraryCard";
import UserTimelineSkeletonCard from "../UserTimeline/UserTimelineSkeletonCard";

const UserIteItinerary = () => {
  const { userName } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itineraryPosts, setItineraryPosts] = useState<IPost[]>([]);
  const [removePostIds, setRemovePostIds] = useState<string[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

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
        { key: "page", value: currentPage },
        { key: "limit", value: 9 },
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
    }
  }, [responseData, currentPage, removePostIds]);

  // Reset itinerary posts and removed post IDs when userName changes
  useEffect(() => {
    setItineraryPosts([]);
    setRemovePostIds([]);
    setCurrentPage(1);
  }, [userName]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const totalResults = responseData?.data?.attributes?.totalResults || 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          !isFetching &&
          itineraryPosts.length < totalResults
        ) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoading, isFetching, itineraryPosts.length, responseData, currentPage]);

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
      <h1 className="text-center text-gray-500 py-8">No Post available</h1>
    );
  } else if (itineraryPosts.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {itineraryPosts?.map((post, index) => (
          <UserIteItineraryCard
            key={`${post._id}-${index}`}
            post={post}
            onRemove={() => handleRemovePost(post._id)}
          />
        ))}
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
      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default UserIteItinerary;
