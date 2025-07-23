"use client";
import useUser from "@/hooks/useUser";
import {
  useGetFeedStoriesQuery,
  useGetStoryQuery,
  useViewStoryMutation,
  useReactToStoryMutation,
  useReplyToStoryMutation,
  // useDeleteStoryMutation,
} from "@/redux/features/stories/storiesApi";
import {
  IReactions,
  IStory,
  IStoryMedia,
  IViewer,
} from "@/types/stories.types";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Send,
  Volume2,
  VolumeX,
  // Trash2,
  // MoreVertical,
  X,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { TError } from "@/types/error";
import Link from "next/link";
import JourneyViewSkeleton from "./JourneyViewSkeleton";

const JourneyView = () => {
  const { journeyId } = useParams();
  const router = useRouter();
  const user = useUser();

  // API hooks
  const { data: responseData, isLoading: storyLoading } = useGetStoryQuery(
    journeyId as string,
    {
      skip: !journeyId,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: feedData, isLoading: feedLoading } =
    useGetFeedStoriesQuery(undefined);

  const [viewStory] = useViewStoryMutation();
  const [reactToStory] = useReactToStoryMutation();
  const [replyToStory] = useReplyToStoryMutation();
  // const [deleteStory] = useDeleteStoryMutation();

  // State management
  const [currentStory, setCurrentStory] = useState<IStory | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [allStories, setAllStories] = useState<IStory[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const [hasViewedCurrent, setHasViewedCurrent] = useState(false);

  // New state for tracking reactions per media
  const [mediaReactions, setMediaReactions] = useState<{
    [mediaId: string]: {
      isLiked: boolean;
      reactions: IReactions[];
    };
  }>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  // const showMenuRef = useRef<HTMLDivElement>(null);

  // Constants
  const STORY_DURATION = 7000;
  const storyData = responseData?.data?.attributes;

  // Initialize current story and reactions
  useEffect(() => {
    if (storyData) {
      setCurrentStory(storyData);
      setHasViewedCurrent(false);

      // Initialize reactions for all media in the story
      const reactionsMap: {
        [mediaId: string]: { isLiked: boolean; reactions: IReactions[] };
      } = {};

      storyData.mediaIds?.forEach((media: IStoryMedia) => {
        const userReaction = media.reactions?.find(
          (reaction: IReactions) => reaction.userId._id === user?._id
        );

        reactionsMap[media._id] = {
          isLiked: !!userReaction,
          reactions: media.reactions || [],
        };
      });

      setMediaReactions(reactionsMap);
    }
  }, [storyData, user?._id]);

  // Initialize all stories and current story index
  useEffect(() => {
    if (feedData?.data?.attributes?.results) {
      const stories = feedData.data.attributes.results.map((story: IStory) => ({
        _id: story._id,
        userId: story.userId,
        mediaIds: story.mediaIds,
        privacy: story.privacy,
        expiresAt: story.expiresAt,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
      }));

      setAllStories(stories);

      const index = stories.findIndex(
        (story: IStory) => story._id === journeyId
      );
      setCurrentStoryIndex(index >= 0 ? index : 0);
    }
  }, [feedData, journeyId]);

  // Track story view
  useEffect(() => {
    const trackView = async () => {
      if (
        currentStory &&
        !hasViewedCurrent &&
        currentStory.mediaIds?.[currentMediaIndex]
      ) {
        const mediaId = currentStory.mediaIds[currentMediaIndex]._id;
        try {
          await viewStory(mediaId).unwrap();
          setHasViewedCurrent(true);
        } catch (error) {
          console.error("Failed to track story view:", error);
        }
      }
    };

    const viewTimeout = setTimeout(trackView, 1000);
    return () => clearTimeout(viewTimeout);
  }, [currentStory, currentMediaIndex, viewStory, hasViewedCurrent]);

  // Reset view tracking when media changes
  useEffect(() => {
    setHasViewedCurrent(false);
  }, [currentMediaIndex, journeyId]);

  const handleNext = useCallback(() => {
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
        router.push(`/journey/${allStories[nextStoryIndex]._id}`);
      } else {
        router.push("/");
      }
    }
  }, [currentStory, currentMediaIndex, currentStoryIndex, allStories, router]);

  const clearProgressTimer = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startProgress = useCallback(() => {
    clearProgressTimer();
    setProgress(0);
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;

    progressIntervalRef.current = window.setInterval(() => {
      const currentTime = Date.now();
      const elapsed =
        currentTime - startTimeRef.current - pausedTimeRef.current;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        clearProgressTimer();
        handleNext();
      }
    }, 50);
  }, [STORY_DURATION, handleNext, clearProgressTimer]);

  const pauseProgress = useCallback(() => {
    if (!isPaused) {
      pausedTimeRef.current += Date.now() - startTimeRef.current;
      clearProgressTimer();
    }
  }, [isPaused, clearProgressTimer]);

  // Handle progress based on pause state
  useEffect(() => {
    if (!isPaused && currentStory) {
      startProgress();
    } else {
      pauseProgress();
    }

    return () => {
      clearProgressTimer();
    };
  }, [
    currentMediaIndex,
    isPaused,
    currentStory,
    startProgress,
    pauseProgress,
    clearProgressTimer,
  ]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video play failed:", error);
      });
    }
  }, [currentMediaIndex]);

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
      router.push(`/journey/${allStories[prevStoryIndex]._id}`);
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
    router.push(`/journey/${story._id}`);
  };

  const handleLike = async () => {
    if (currentStory?.mediaIds?.[currentMediaIndex]) {
      const wasPaused = isPaused;
      setIsPaused(true);
      const mediaId = currentStory.mediaIds[currentMediaIndex]._id;
      try {
        await reactToStory({
          mediaId,
          reactionType: "love",
        }).unwrap();

        // Update local state
        setMediaReactions((prev) => ({
          ...prev,
          [mediaId]: {
            ...prev[mediaId],
            isLiked: !prev[mediaId]?.isLiked,
          },
        }));
      } catch (error) {
        console.error("Failed to react to story:", error);
      } finally {
        if (!wasPaused) {
          setIsPaused(false);
        }
      }
    }
  };

  const handleReply = async () => {
    if (replyText.trim() && currentStory?.mediaIds?.[currentMediaIndex]) {
      const wasPaused = isPaused;
      setIsPaused(true);

      const mediaId = currentStory.mediaIds[currentMediaIndex]._id;
      try {
        const res = await replyToStory({
          mediaId,
          message: replyText.trim(),
        }).unwrap();
        const receiverId = res?.data?.attributes?.receiverId?._id;
        setReplyText("");
        toast.success("Reply sent successfully!");
        router.push(`/messages/${receiverId}`);
      } catch (error) {
        const err = error as TError;
        toast.error(err?.data?.message || "Something went wrong!");
      } finally {
        if (!wasPaused) {
          setIsPaused(false);
        }
      }
    }
  };

  // const handleDeleteStory = async (mediaId: string) => {
  //   try {
  //     await deleteStory(mediaId).unwrap();
  //     if (allStories.length > 1) {
  //       handleNext();
  //     } else {
  //       router.push("/");
  //     }
  //   } catch (error) {
  //     const err = error as TError;
  //     toast.error(err?.data?.message || "Something went wrong!");
  //   }
  // };

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
        <JourneyViewSkeleton />
      </div>
    );
  }

  if (!currentStory) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-lg">Journey not found</div>
      </div>
    );
  }

  const currentMedia = currentStory.mediaIds?.[currentMediaIndex];
  const isVideo = currentMedia?.mediaType === "video";
  const isImage = currentMedia?.mediaType === "image";
  const isMixed = currentMedia?.mediaType === "mixed";
  const isOwnStory = user?._id === currentStory?.userId?._id;

  // Get current media's reaction state
  const currentMediaReaction = mediaReactions[currentMedia?._id] || {
    isLiked: false,
    reactions: [],
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md h-full bg-black overflow-hidden">
        {/* Progress bars */}
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

        {/* Header */}
        <div className="absolute top-6 left-2 right-2 z-30 flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <Image
              src={currentStory?.userId?.profileImage || "/default-avatar.png"}
              alt={currentStory?.userId?.username || "User"}
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
              width={32}
              height={32}
            />
            <Link href={`/${currentStory?.userId?.username}`}>
              <span className="text-white text-sm font-medium hover:underline">
                {currentStory?.userId?.username || "Unknown User"}
              </span>
            </Link>
            <span className="text-gray-300 text-xs">
              {formatTimeAgo(currentStory?.createdAt)}
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
            {/* {isOwnStory ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded-full bg-gray-300/20 cursor-pointer"
                >
                  <MoreVertical className="w-5 h-5 text-white" />
                </button>
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      ref={showMenuRef}
                      className="absolute right-0 mt-1 w-36 p-1 bg-gray-600 shadow-2xl rounded-xl z-50 cursor-pointer"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <button
                        onClick={() => handleDeleteStory(currentMedia?._id)}
                        className="flex items-center gap-2 text-white text-sm p-2"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              
            )} */}
            <button
              onClick={() => router.push(`/`)}
              className="p-1 rounded-full bg-black/20 cursor-pointer"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
        >
          {/* Touch areas for navigation */}
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

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
          {isOwnStory ? (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div
                  className="text-white text-sm font-medium cursor-pointer flex items-center gap-2"
                  onClick={() => setShowViewers(true)}
                >
                  <Eye className="w-4 h-4" />
                  Viewed by {currentMedia?.viewedBy?.length || 0}
                </div>

                {/* Show reaction count for current media */}
                {currentMedia?.reactions?.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                    <span className="text-white text-xs">
                      {currentMedia.reactions.length} reactions
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center bg-transparent border border-white rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Reply to journey..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleReply()}
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                />
              </div>
              <button
                onClick={handleLike}
                className={`p-2 rounded-full cursor-pointer bg-transparent transition-colors ${
                  currentMediaReaction.isLiked ? "text-red-500" : "text-white"
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${
                    currentMediaReaction.isLiked ? "fill-current" : ""
                  }`}
                />
              </button>
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="p-2 rounded-full bg-transparent transition-colors cursor-pointer text-white"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop navigation arrows */}
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

      {/* Viewers Modal for own stories */}
      <AnimatePresence>
        {showViewers && isOwnStory && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewers(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-900 font-semibold">
                  Views & Reactions
                </h3>
                <button
                  onClick={() => setShowViewers(false)}
                  className="text-gray-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current Media Views */}
              <div className="mb-4">
                <h4 className="text-gray-900 text-sm mb-2">
                  Views ({currentMedia?.viewedBy?.length || 0})
                </h4>
                {currentMedia?.viewedBy?.length > 0 ? (
                  <div className="space-y-2">
                    {currentMedia.viewedBy
                      .filter((viewer: IViewer) => viewer?._id !== user?._id)
                      .map((viewer: IViewer) => (
                        <div
                          key={viewer?._id}
                          className="flex items-center gap-3"
                        >
                          <Image
                            src={viewer?.profileImage || "/default-avatar.png"}
                            alt={viewer?.username}
                            className="w-8 h-8 rounded-full object-cover"
                            width={32}
                            height={32}
                          />
                          <Link
                            href={`/${viewer?.username}`}
                            className="text-gray-900 text-sm hover:underline"
                          >
                            {viewer?.username}
                          </Link>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-900 text-sm">No views yet</p>
                )}
              </div>

              {/* Current Media Reactions */}
              <div>
                <h4 className="text-gray-900 text-sm mb-2">
                  Reactions ({currentMedia?.reactions?.length || 0})
                </h4>
                {currentMedia?.reactions?.length > 0 ? (
                  <div className="space-y-2">
                    {currentMedia?.reactions
                      ?.filter((reaction) => reaction?.userId !== user?._id)
                      ?.map((reaction: IReactions, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <Image
                            src={
                              reaction.userId.profileImage ||
                              "/default-avatar.png"
                            }
                            alt={reaction.userId.username}
                            className="w-8 h-8 rounded-full object-cover"
                            width={32}
                            height={32}
                          />
                          <Link
                            href={`/${reaction?.userId?.username}`}
                            className="text-gray-900 text-sm hover:underline"
                          >
                            {reaction?.userId?.username}
                          </Link>
                          <Heart className="w-4 h-4 text-red-500 fill-current ml-auto" />
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No reactions yet</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop story list */}
      {allStories?.length > 0 && (
        <div className="hidden lg:block absolute left-8 top-1/2 transform -translate-y-1/2 z-20">
          <div className="flex flex-col gap-4 max-h-screen overflow-y-auto scrollbar-hide">
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

      {/* Mobile story list */}
      {allStories?.length > 0 && (
        <div className="lg:hidden absolute bottom-20 left-0 right-0 z-20 px-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {allStories?.map((story, index) => (
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

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default JourneyView;
