"use client";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useState, useEffect, useRef } from "react";
import { IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import VideoCard from "./VideoCard";
import UserVideoSkeleton from "./UserVideoSkeleton";

const UserVideos = () => {
  const { userName } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [timelinePosts, setTimelinePosts] = useState<IPost[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Get user timeline posts with videos
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetUserTimelinePostsQuery(
    {
      username: userName,
      filters: [
        { key: "mediaType", value: "video" },
        { key: "page", value: currentPage },
        { key: "limit", value: 8 },
      ],
    },
    { refetchOnMountOrArgChange: true, skip: !userName }
  );

  // Update timeline posts when new data is fetched, ensuring no duplicate _id values
  useEffect(() => {
    const userTimelineVideoData = responseData?.data?.attributes?.results || [];
    if (userTimelineVideoData?.length > 0) {
      setTimelinePosts((prev) => {
        const existingIds = new Set(prev.map((post) => post._id));
        const newPosts = userTimelineVideoData.filter(
          (post: IPost) => !existingIds.has(post._id)
        );
        return currentPage === 1 ? newPosts : [...prev, ...newPosts];
      });
    }
  }, [responseData, currentPage]);

  // Reset timeline posts when userName changes
  useEffect(() => {
    setTimelinePosts([]);
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
          timelinePosts.length < totalResults
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
  }, [isLoading, isFetching, timelinePosts.length, responseData, currentPage]);

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <UserVideoSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  let content = null;
  if (isLoading && currentPage === 1) {
    content = renderLoading();
  } else if (timelinePosts.length === 0 && !isLoading) {
    content = (
      <h1 className="text-center text-gray-500 py-8">
        No timeline videos available
      </h1>
    );
  } else if (timelinePosts.length > 0) {
    const videoMedia = timelinePosts.flatMap(
      (post) => post.media?.filter((media) => media.mediaType === "video") || []
    );
    content = (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {videoMedia.map((media, index) => (
          <VideoCard key={`${media._id}-${index}`} url={media.mediaUrl} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-5 rounded-2xl">
      {/* Header with Title */}
      <div className="flex justify-between mb-4 border-b border-[#B5B7C5] pb-4">
        <h2 className="text-lg font-semibold text-gray-800">Videos</h2>
      </div>
      {/* Video Grid */}
      {content}
      {isFetching && currentPage > 1 && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <UserVideoSkeleton key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default UserVideos;
