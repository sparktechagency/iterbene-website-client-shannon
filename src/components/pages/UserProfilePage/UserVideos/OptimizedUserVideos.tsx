"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { IPost, IMedia } from "@/types/post.types";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useGlobalVideoControl } from "@/hooks/useVideoPlayer";
import EnhancedVideoPlayer from "@/components/common/EnhancedVideoPlayer";
import { SkeletonGrid } from "@/components/common/BaseSkeleton";
import { Play, User } from "lucide-react";

interface VideoWithPost extends IMedia {
  post: IPost;
}

const OptimizedUserVideos: React.FC = () => {
  const { userName } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allVideos, setAllVideos] = useState<VideoWithPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<string | null>(null);
  
  const { pauseAllVideos } = useGlobalVideoControl();

  const username = typeof userName === "string" 
    ? userName 
    : Array.isArray(userName) 
      ? userName[0] 
      : "";

  // API query for user timeline videos
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetUserTimelinePostsQuery(
    {
      username,
      filters: [
        { key: "mediaType", value: "video" },
        { key: "page", value: currentPage.toString() },
        { key: "limit", value: "12" }, // Increased for better grid
      ],
    },
    { 
      refetchOnMountOrArgChange: true, 
      skip: !username,
      refetchOnFocus: false, // Prevent unnecessary refetches
    }
  );

  // Process video data with memoization
  const currentPageVideos = useMemo(() => {
    const posts = responseData?.data?.attributes?.results || [];
    const videos: VideoWithPost[] = [];
    
    posts.forEach((post: IPost) => {
      post.media?.forEach((media) => {
        if (media.mediaType === "video") {
          videos.push({ ...media, post });
        }
      });
    });
    
    return videos;
  }, [responseData]);

  const totalPages = responseData?.data?.attributes?.totalPages || 0;

  // Update videos when new data arrives
  useEffect(() => {
    if (currentPageVideos.length > 0) {
      if (currentPage === 1) {
        setAllVideos(currentPageVideos);
      } else {
        setAllVideos(prev => {
          const existingIds = new Set(prev.map(video => video._id));
          const newVideos = currentPageVideos.filter(
            video => !existingIds.has(video._id)
          );
          return [...prev, ...newVideos];
        });
      }
    }
  }, [currentPageVideos, currentPage]);

  // Update hasMore state
  useEffect(() => {
    setHasMore(currentPage < totalPages);
  }, [currentPage, totalPages]);

  // Reset when username changes
  useEffect(() => {
    setAllVideos([]);
    setCurrentPage(1);
    setHasMore(true);
    setCurrentPlayingVideo(null);
    pauseAllVideos();
  }, [username, pauseAllVideos]);

  // Infinite scroll hook
  const { lastElementRef } = useInfiniteScroll({
    isLoading,
    isFetching,
    hasMore,
    onLoadMore: () => setCurrentPage(prev => prev + 1),
    threshold: 0.1,
    rootMargin: '200px'
  });

  // Handle video play - ensure only one video plays at a time
  const handleVideoPlay = (videoId: string) => {
    if (currentPlayingVideo && currentPlayingVideo !== videoId) {
      pauseAllVideos();
    }
    setCurrentPlayingVideo(videoId);
  };

  const handleVideoPause = () => {
    setCurrentPlayingVideo(null);
  };

  // Memoized video card component
  const VideoCard = React.memo<{ 
    video: VideoWithPost; 
    isLast: boolean;
    onPlay: () => void;
    onPause: () => void;
  }>(({ video, isLast, onPlay, onPause }) => {
    const cardRef = isLast ? lastElementRef : null;

    return (
      <div 
        ref={cardRef}
        className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        {/* Video Player */}
        <div className="aspect-[9/16] relative">
          <EnhancedVideoPlayer
            src={video.mediaUrl}
            videoId={video._id}
            className="w-full h-full"
            controls={true}
            onPlay={onPlay}
            onPause={onPause}
            showRestartButton={true}
            showVolumeControl={true}
          />
          
          {/* Video overlay info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-white text-sm">
              <User className="w-4 h-4" />
              <span className="font-medium">{video.post.userId.fullName}</span>
            </div>
            {video.post.content && (
              <p className="text-white/90 text-xs mt-1 line-clamp-2">
                {video.post.content}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  });

  VideoCard.displayName = 'VideoCard';

  // Render loading state
  if (isLoading && currentPage === 1) {
    return (
      <div className="w-full">
        <SkeletonGrid 
          items={12} 
          columns={4} 
          aspectRatio="aspect-[9/16]"
          className="gap-4"
        />
      </div>
    );
  }

  // Render empty state
  if (allVideos.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Play className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
        <p className="text-gray-500 text-center max-w-sm">
          This user hasn&apos;t shared any videos yet. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allVideos.map((video, index) => (
          <VideoCard
            key={video._id}
            video={video}
            isLast={index === allVideos.length - 1}
            onPlay={() => handleVideoPlay(video._id)}
            onPause={handleVideoPause}
          />
        ))}
      </div>

      {/* Loading indicator for pagination */}
      {isFetching && hasMore && currentPage > 1 && (
        <div className="mt-8">
          <SkeletonGrid 
            items={4} 
            columns={4} 
            aspectRatio="aspect-[9/16]"
            className="gap-4"
          />
        </div>
      )}

      {/* End of results message */}
      {!hasMore && allVideos.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You&apos;ve reached the end of the videos</p>
        </div>
      )}
    </div>
  );
};

export default OptimizedUserVideos;