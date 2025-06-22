"use client";
import useUser from "@/hooks/useUser";
import {
  useGetFeedStoriesQuery,
  useGetStoryQuery,
} from "@/redux/features/stories/storiesApi";
import { IStory } from "@/types/stories.types";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const StoryView = () => {
  const { storyId } = useParams();
  const router = useRouter();
  const user = useUser();
  const { data: responseData, isLoading: storyLoading } = useGetStoryQuery(
    storyId as string
  );
  const { data: feedData, isLoading: feedLoading } =
    useGetFeedStoriesQuery(undefined);

  const [currentStory, setCurrentStory] = useState<IStory | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [allStories, setAllStories] = useState<IStory[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const STORY_DURATION = 7000;

  const storyData = responseData?.data?.attributes;

  useEffect(() => {
    if (storyData) {
      setCurrentStory(storyData);
    }
  }, [storyData]);

  useEffect(() => {
    if (feedData?.data?.attributes?.results) {
      const stories = feedData.data.attributes.results.map((story: IStory) => ({
        _id: story._id,
        userId: story.userId,
        mediaIds: story.mediaIds,
        viewedBy: story.viewedBy,
        reactions: story.reactions,
        replies: story.replies,
        privacy: story.privacy,
        expiresAt: story.expiresAt,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
      }));

      setAllStories(stories);

      const index = stories.findIndex((story: IStory) => story._id === storyId);
      setCurrentStoryIndex(index >= 0 ? index : 0);
    }
  }, [feedData, storyId]);

  const handleNext = React.useCallback(() => {
    if (
      currentStory &&
      currentMediaIndex < (currentStory.mediaIds?.length ?? 0) - 1
    ) {
      setCurrentMediaIndex((prev) => prev + 1);
    } else {
      const nextStoryIndex = currentStoryIndex + 1;
      if (nextStoryIndex < allStories.length) {
        setCurrentStoryIndex(nextStoryIndex);
        setCurrentStory(allStories[nextStoryIndex]);
        setCurrentMediaIndex(0);
        router.push(`/story/${allStories[nextStoryIndex]._id}`);
      } else {
        router.push("/");
      }
    }
  }, [currentStory, currentMediaIndex, currentStoryIndex, allStories, router]);

  const startProgress = React.useCallback(() => {
    setProgress(0);
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        handleNext();
      } else if (!isPaused) {
        requestAnimationFrame(updateProgress);
      }
    };

    if (!isPaused) {
      requestAnimationFrame(updateProgress);
    }
  }, [STORY_DURATION, isPaused, handleNext]);

  useEffect(() => {
    if (!isPaused && currentStory) {
      startProgress();
    } else {
      pauseProgress();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentMediaIndex, isPaused, currentStory, startProgress]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video play failed:", error);
      });
    }
  }, [currentMediaIndex]);

  const pauseProgress = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handlePrev = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    } else if (currentStoryIndex > 0) {
      const prevStoryIndex = currentStoryIndex - 1;
      setCurrentStoryIndex(prevStoryIndex);
      setCurrentStory(allStories[prevStoryIndex]);
      setCurrentMediaIndex(
        (allStories[prevStoryIndex].mediaIds?.length ?? 0) - 1
      );
      router.push(`/story/${allStories[prevStoryIndex]._id}`);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;
    const touchX = touch.clientX;

    if (touchX < screenWidth / 2) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  const handleMouseDown = () => {
    setIsPaused(true);
  };

  const handleMouseUp = () => {
    setIsPaused(false);
  };

  const handleStorySelect = (story: IStory, index: number) => {
    setCurrentStoryIndex(index);
    setCurrentStory(story);
    setCurrentMediaIndex(0);
    router.push(`/story/${story._id}`);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return "now";
    }
  };

  if (storyLoading || feedLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-lg">Loading story...</div>
      </div>
    );
  }

  if (!currentStory) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-lg">Story not found</div>
      </div>
    );
  }

  const currentMedia = currentStory.mediaIds?.[currentMediaIndex];
  const isVideo = currentMedia?.mediaType === "video";
  const isImage = currentMedia?.mediaType === "image";
  const isMixed = currentMedia?.mediaType === "mixed";
  const isOwnStory = user?._id === currentStory.userId._id;

  console.log("Story media:", responseData);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md h-full bg-black overflow-hidden">
        <div className="absolute top-2 left-2 right-2 z-30 flex gap-1">
          {currentStory.mediaIds?.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-0.5 bg-gray-600 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width:
                    index < currentMediaIndex
                      ? "100%"
                      : index === currentMediaIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-6 left-2 right-2 z-30 flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <Image
              src={currentStory.userId?.profileImage || "/default-avatar.png"}
              alt={currentStory.userId?.username || "User"}
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
              width={32}
              height={32}
            />
            <span className="text-white text-sm font-medium">
              {currentStory.userId?.username || "Unknown User"}
            </span>
            <span className="text-gray-300 text-xs">
              {formatTimeAgo(currentStory.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isVideo && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 rounded-full bg-black/20"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            )}
            <button
              onClick={() => router.push("/")}
              className="p-1 rounded-full bg-black/20 cursor-pointer"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div
          className="relative w-full h-full flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
        >
          <div className="absolute left-0 top-0 w-1/2 h-full z-20" />
          <div className="absolute right-0 top-0 w-1/2 h-full z-20" />

          {currentMedia && (
            <>
              {isVideo ? (
                <video
                  ref={videoRef}
                  src={currentMedia.mediaUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted={isMuted}
                  playsInline
                  onEnded={handleNext}
                />
              ) : isImage || isMixed ? (
                <div
                  className="w-full h-full flex items-center justify-center relative"
                  style={{
                    backgroundColor: currentMedia.backgroundColor || "#000",
                  }}
                >
                  {currentMedia?.mediaUrl && (
                    <Image
                      src={currentMedia.mediaUrl}
                      alt="Story content"
                      className="max-w-full max-h-full object-contain"
                      fill
                    />
                  )}
                </div>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center relative"
                  style={{
                    backgroundColor: currentMedia.backgroundColor || "#000",
                  }}
                >
                  {currentMedia.textContent && (
                    <h1
                      className="text-white text-xl"
                      style={{ fontFamily: currentMedia.textFontFamily }}
                    >
                      {currentMedia.textContent}
                    </h1>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
          {isOwnStory ? (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-white text-sm font-medium">
                  Viewed by {currentStory?.viewedBy?.length || 0}
                </div>
                {currentStory?.viewedBy?.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    {currentStory.viewedBy
                      .slice(0, 3)
                      .map((viewer) => (
                        <div
                          key={viewer._id}
                          className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                        >
                          <Image
                            src={viewer.profileImage || "/default-avatar.png"}
                            alt={viewer.username || "Viewer"}
                            className="w-full h-full object-cover"
                            width={32}
                            height={32}
                          />
                        </div>
                      ))}
                    {currentStory?.viewedBy?.length > 3 && (
                      <div className="text-white text-xs">
                        +{currentStory.viewedBy.length - 3} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center bg-transparent border border-gray-400 rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Reply to story..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm outline-none"
                />
              </div>
              <button className="p-2 rounded-full bg-transparent">
                <Heart className="w-6 h-6 text-white" />
              </button>
              <button className="p-2 rounded-full bg-transparent">
                <Send className="w-6 h-6 text-white" />
              </button>
            </div>
          )}
        </div>

        <div className="hidden md:block">
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 cursor-pointer transform -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            disabled={currentStoryIndex === 0 && currentMediaIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 cursor-pointer top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {allStories?.length > 0 && (
        <div className="hidden lg:block absolute left-8 top-1/2 transform -translate-y-1/2 z-20">
          <div className="flex flex-col gap-4 max-h-96 overflow-y-auto">
            {allStories.map((story, index) => (
              <div
                key={story._id}
                className={`w-16 h-16 rounded-full p-0.5 cursor-pointer transition-all ${
                  index === currentStoryIndex
                    ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
                    : "bg-gray-600"
                }`}
                onClick={() => handleStorySelect(story, index)}
              >
                <Image
                  src={story.userId?.profileImage || "/default-avatar.png"}
                  alt={story.userId?.username || "User"}
                  className="w-full h-full rounded-full object-cover border-2 border-black"
                  width={48}
                  height={48}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {allStories.length > 0 && (
        <div className="lg:hidden absolute bottom-20 left-0 right-0 z-20 px-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {allStories.map((story, index) => (
              <div
                key={story._id}
                className={`flex-shrink-0 w-12 h-12 rounded-full p-0.5 cursor-pointer transition-all ${
                  index === currentStoryIndex
                    ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
                    : "bg-gray-600"
                }`}
                onClick={() => handleStorySelect(story, index)}
              >
                <Image
                  src={story.userId?.profileImage || "/default-avatar.png"}
                  alt={story.userId?.username || "User"}
                  className="w-full h-full rounded-full object-cover border-2 border-black"
                  width={48}
                  height={48}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryView;