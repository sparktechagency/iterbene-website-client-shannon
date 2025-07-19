"use client";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useState, useEffect, useRef, useCallback } from "react";
import { IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import VideoCard from "./VideoCard";
import UserVideoSkeleton from "./UserVideoSkeleton";

const UserVideos = () => {
  const { userName } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [timelinePosts, setTimelinePosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

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
        { key: "page", value: currentPage.toString() },
        { key: "limit", value: "8" },
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
      setHasMore(currentPage < (responseData.data.attributes.totalPages || 0));
    }
  }, [responseData, currentPage]);

  // Reset timeline posts when userName changes
  useEffect(() => {
    setTimelinePosts([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [userName]);

  // Set up IntersectionObserver for infinite scroll (from Posts)
  const lastVideoElementRef = useCallback(
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
        {videoMedia.map((media, index) => {
          // Attach ref to the last video for infinite scroll
          if (index === videoMedia.length - 1) {
            return (
              <div key={media._id} ref={lastVideoElementRef}>
                <VideoCard
                  url={media.mediaUrl}
                  className="w-full h-[200px] md:h-[300px]"
                />
              </div>
            );
          }
          return (
            <VideoCard
              key={media._id}
              url={media.mediaUrl}
              className="h-[200px] md:h-[300px]"
            />
          );
        })}
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
      <div ref={loaderRef} className="h-10" />
    </div>
  );
};

export default UserVideos;
