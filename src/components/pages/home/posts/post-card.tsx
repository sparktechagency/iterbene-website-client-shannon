"use client";
import CustomModal from "@/components/custom/custom-modal";
import useUser from "@/hooks/useUser";
import { openAuthModal } from "@/redux/features/auth/authModalSlice";
import {
  useAddOrRemoveReactionMutation,
  useIncrementItineraryViewCountMutation,
} from "@/redux/features/post/postApi";
import { useAppDispatch } from "@/redux/hooks";
import { TError } from "@/types/error";
import {
  IPost,
  IReaction,
  ISortedReaction,
  ReactionType,
} from "@/types/post.types";
import { getFullName } from "@/utils/nameUtils";
import formatPostReactionNumber from "@/utils/formatPostReactionNumber";
import { Tooltip } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { JSX, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import PostEditModal from "../create-post/PostEditModal";
import ShowItineraryModal from "../create-post/ShowItineraryModal";
import PostDetails from "../post-details/PostDetails";
import PostCommentInput from "./post.comment.input";
import PostCommentSection from "./post.comment.section";
import PostContentRender from "./post.content-render";
import PostHeader from "./post.header";

interface PostCardProps {
  post: IPost;
  setAllPosts?: (posts: IPost[] | ((prev: IPost[]) => IPost[])) => void;
}

const PostCard = ({ post, setAllPosts }: PostCardProps) => {
  const user = useUser();
  const postRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const currentUserId = user?._id;
  const [showReactions, setShowReactions] = useState<boolean>(false);
  const [showReactionDetails, setShowReactionDetails] =
    useState<boolean>(false);
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>("");
  const [showPostDetails, setShowPostDetails] = useState<boolean>(false);
  const [showItineraryModal, setShowItineraryModal] = useState<boolean>(false);
  const [showPostEditModal, setShowPostEditModal] = useState<boolean>(false);

  // Reaction timing refs for better control
  const showReactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideReactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useAppDispatch();

  const [incrementItinerary] = useIncrementItineraryViewCountMutation();
  const [addOrRemoveReaction] = useAddOrRemoveReactionMutation();

  // Intersection observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersectionRatio = entry.intersectionRatio;
        const isIntersecting = entry.isIntersecting;

        let newVisibility = false;

        if (isIntersecting && intersectionRatio >= 0.5) {
          newVisibility = true;
        } else if (!isIntersecting || intersectionRatio < 0.3) {
          newVisibility = false;
        } else {
          return;
        }

        const timeoutId = setTimeout(() => {
          setIsVisible(newVisibility);
        }, 100);

        return () => clearTimeout(timeoutId);
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "-20px 0px -20px 0px",
      }
    );

    if (postRef.current) {
      observer.observe(postRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleEdit = (commentId: string, commentText: string) => {
    setEditCommentId(commentId);
    setEditCommentText(commentText);
  };

  const handleShowReactions = () => {
    // Clear any pending hide timeout
    if (hideReactionTimeoutRef.current) {
      clearTimeout(hideReactionTimeoutRef.current);
      hideReactionTimeoutRef.current = null;
    }

    // Show reactions after 500ms delay (like Facebook)
    showReactionTimeoutRef.current = setTimeout(() => {
      setShowReactions(true);
    }, 500);
  };

  // Handle heart button click - should not show reactions
  const handleHeartButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear any pending timeouts to prevent reactions from showing
    if (showReactionTimeoutRef.current) {
      clearTimeout(showReactionTimeoutRef.current);
      showReactionTimeoutRef.current = null;
    }
    if (hideReactionTimeoutRef.current) {
      clearTimeout(hideReactionTimeoutRef.current);
      hideReactionTimeoutRef.current = null;
    }

    // Directly handle heart reaction
    if (userReaction) {
      handleReaction(userReaction.reactionType);
    } else {
      handleReaction("heart");
    }
  };

  const handleHideReactions = () => {
    // Clear any pending show timeout
    if (showReactionTimeoutRef.current) {
      clearTimeout(showReactionTimeoutRef.current);
      showReactionTimeoutRef.current = null;
    }

    // Hide reactions after 1500ms delay (like Facebook)
    hideReactionTimeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 1500);
  };

  const cancelHideReactions = () => {
    if (hideReactionTimeoutRef.current) {
      clearTimeout(hideReactionTimeoutRef.current);
      hideReactionTimeoutRef.current = null;
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (showReactionTimeoutRef.current) {
        clearTimeout(showReactionTimeoutRef.current);
      }
      if (hideReactionTimeoutRef.current) {
        clearTimeout(hideReactionTimeoutRef.current);
      }
    };
  }, []);

  // Ensure reactions array is initialized
  const reactions = post?.reactions || [];

  // Find the user's reaction, if any
  const userReaction = reactions.find(
    (reaction: IReaction) => reaction?.userId?._id === currentUserId
  );

  // Get reactions with non-zero counts
  const nonZeroReactions = post?.sortedReactions?.filter(
    (reaction: ISortedReaction) => reaction?.count > 0
  );

  const reactionIcons: { [key: string]: JSX.Element } = {
    heart: <h1 className="text-[22px] emoji-font">❤️</h1>,
    suitcase: <h1 className="text-[22px] emoji-font">🧳</h1>,
    not_interested: <h1 className="text-[22px] emoji-font">🚫</h1>,
    smile: <h1 className="text-[22px] emoji-font">🙂</h1>,
  };

  // Reaction colors
  const reactionColors: { [key: string]: string } = {
    heart: "text-red-500",
    suitcase: "text-blue-500",
    not_interested: "text-rose-500",
    smile: "text-yellow-500",
  };

  // Update sortedReactions based on reactions array
  const updateSortedReactions = (reactions: IReaction[]): ISortedReaction[] => {
    const reactionCounts = reactions.reduce((acc, reaction) => {
      const type = reaction.reactionType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(reactionCounts).map((type) => ({
      type: type as ReactionType,
      count: reactionCounts[type],
    }));
  };

  // Reaction handler with improved optimistic update
  const handleReaction = async (reactionType: string) => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }
    // Close reaction bar only after selection (like Facebook)
    setShowReactions(false);

    // Clear any pending timeouts
    if (showReactionTimeoutRef.current) {
      clearTimeout(showReactionTimeoutRef.current);
      showReactionTimeoutRef.current = null;
    }
    if (hideReactionTimeoutRef.current) {
      clearTimeout(hideReactionTimeoutRef.current);
      hideReactionTimeoutRef.current = null;
    }

    try {
      await addOrRemoveReaction({ postId: post._id, reactionType }).unwrap();
      // Optimistic update: Update reactions and sortedReactions
      if (setAllPosts) {
        setAllPosts((prevPosts: IPost[]) =>
          prevPosts.map((p) => {
            if (p._id === post._id) {
              // Ensure reactions array exists
              const currentReactions = p.reactions || [];
              console.log("Current reactions:", currentReactions);

              // Check if user already has any reaction on this post
              const existingReaction = currentReactions.find(
                (r) => r.userId._id === user._id
              );
              const isSameReaction =
                existingReaction?.reactionType === reactionType;

              console.log("Existing reaction:", existingReaction);
              console.log("Is same reaction:", isSameReaction);

              let updatedReactions;

              if (isSameReaction) {
                // Remove reaction if clicking the same reaction
                updatedReactions = currentReactions.filter(
                  (r) => r.userId._id !== user._id
                );
              } else {
                // Remove existing reaction first, then add new one
                updatedReactions = currentReactions.filter(
                  (r) => r.userId._id !== user._id
                );
                updatedReactions.push({
                  userId: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    profileImage: user.profileImage,
                    id: user._id,
                  },
                  postId: post._id,
                  reactionType: reactionType as ReactionType,
                  createdAt: new Date(),
                });
              }

              console.log("Updated reactions:", updatedReactions);

              return {
                ...p,
                reactions: updatedReactions,
                sortedReactions: updateSortedReactions(updatedReactions),
              };
            }
            return p;
          })
        );
      }
    } catch (error) {
      console.error("API call failed:", error);
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handlePostUpdated = () => {
    setShowPostEditModal(false);
  };

  const handleItineraryClick = async () => {
    try {
      setShowItineraryModal(true);
      const payload = { postId: post?._id, itineraryId: post?.itinerary?._id };
      await incrementItinerary(payload).unwrap();
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div ref={postRef} className="w-full bg-white rounded-xl p-4 mb-4 relative">
      <PostHeader
        post={post}
        onEditClick={() => setShowPostEditModal(true)}
        setAllPosts={setAllPosts}
      />

      <div className="text-gray-700 mb-4 whitespace-pre-wrap break-words">
        {/* Render text with highlighted hashtags */}
        {post?.content?.split("\n").map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line.split(/(\s+)/).map((word, wordIndex) => {
              const isHashtag = word?.match(/^#\w+/);
              return (
                <span key={`${lineIndex}-${wordIndex}`}>
                  {isHashtag ? (
                    <Link
                      href={`/search/hashtag/?q=${word.slice(1)}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {word}
                    </Link>
                  ) : (
                    word
                  )}
                </span>
              );
            })}
            {lineIndex < post?.content?.split("\n").length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>

      <PostContentRender data={post?.media || []} isVisible={isVisible} />

      {/* Itinerary section */}
      {post?.itinerary && (
        <div
          onClick={handleItineraryClick}
          className="px-4 py-2 mt-5 border cursor-pointer rounded-full text-gray-600 border-gray-200 flex items-center justify-between text-sm"
        >
          <span>Click to view full itinerary</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            PDF Download Available
          </span>
        </div>
      )}

      {/* Reactions summary */}
      <div className="mt-5">
        {nonZeroReactions?.length > 0 && (
          <div className="relative mb-2 mt-2">
            <div
              onClick={() => setShowReactionDetails(true)}
              className="w-fit flex items-center gap-1 cursor-pointer"
            >
              <div className="flex -space-x-1 cursor-pointer">
                {nonZeroReactions?.map((reaction) => (
                  <div key={reaction?.type}>
                    <span className={`${reactionColors[reaction?.type]}`}>
                      {reactionIcons[reaction?.type]}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-[18px] hover:underline cursor-pointer font-semibold text-gray-500">
                {formatPostReactionNumber(post?.reactions?.length || 0)}
              </span>
            </div>

            {/* Reaction details modal */}
            <CustomModal
              header={
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
                  <h2 className="text-xl font-semibold text-gray-800">
                    All Reactions
                  </h2>
                  <button
                    className="text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
                    onClick={() => setShowReactionDetails(false)}
                  >
                    <IoMdClose size={18} />
                  </button>
                </div>
              }
              isOpen={showReactionDetails}
              onClose={() => setShowReactionDetails(false)}
              maxHeight="h-[50vh]"
              className="w-full p-2"
            >
              {post?.reactions?.length > 0 && (
                <div className="w-full space-y-2">
                  {post?.reactions?.map((reaction) => (
                    <div key={reaction?.userId?._id}>
                      <div className="flex justify-between items-center gap-2 border-b border-gray-200 pb-1">
                        <div className="flex items-center gap-3">
                          <Image
                            src={reaction?.userId?.profileImage}
                            alt={getFullName(reaction?.userId) || "User"}
                            width={40}
                            height={40}
                            className="size-[40px] rounded-full"
                          />
                          <div className="flex flex-col mt-2">
                            <Link href={`/${reaction?.userId?.username}`}>
                              <h1 className="font-semibold hover:underline">
                                {getFullName(reaction?.userId)}
                              </h1>
                            </Link>
                            <span className="text-gray-500">
                              {reaction?.userId?.username}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`${
                            reactionColors[reaction?.reactionType]
                          }`}
                        >
                          {reactionIcons[reaction?.reactionType]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CustomModal>
          </div>
        )}

        <div className="flex gap-7 items-center border-y border-[#DDDDDD] py-3">
          <div
            className="relative flex items-center"
            onMouseEnter={handleShowReactions}
            onMouseLeave={handleHideReactions}
          >
            <button
              className="flex gap-2 items-center cursor-pointer ml-1 transition-all duration-200"
              onClick={handleHeartButtonClick}
              onFocus={handleShowReactions}
              onBlur={handleHideReactions}
            >
              {userReaction ? (
                <>
                  <span
                    className={`${reactionColors[userReaction?.reactionType]}`}
                  >
                    {reactionIcons[userReaction?.reactionType]}
                  </span>
                  <span
                    className={`font-semibold capitalize ${
                      reactionColors[userReaction?.reactionType]
                    }`}
                  >
                    <span className="text-sm md:text-base font-semibold">
                      {userReaction?.reactionType === "not_interested"
                        ? "Not Interested"
                        : userReaction?.reactionType}
                    </span>
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1">
                  <h1
                    className="text-[22px] emoji-font"
                    style={{
                      filter: "grayscale(100%)",
                    }}
                  >
                    ❤️
                  </h1>
                  <span className="text-sm md:text-base font-semibold text-gray-500">
                    Heart
                  </span>
                </div>
              )}
            </button>

            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: -9, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute -top-12 -left-2 bg-white border border-gray-100 rounded-full shadow-xl px-3 py-2 flex space-x-2 z-50"
                  onMouseEnter={cancelHideReactions}
                  onMouseLeave={handleHideReactions}
                >
                  {Object.keys(ReactionType)?.map((reactionKey) => {
                    const reaction =
                      ReactionType[
                        reactionKey as keyof typeof ReactionType
                      ]?.toLowerCase();
                    return (
                      <motion.button
                        key={reaction}
                        onClick={() => handleReaction(reaction)}
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.9 }}
                        className={`text-2xl cursor-pointer ${
                          userReaction?.reactionType === reaction
                            ? reactionColors[reaction]
                            : "text-gray-500 hover:text-secondary"
                        }`}
                      >
                        <Tooltip
                          title={
                            reaction?.charAt(0)?.toUpperCase() +
                              reaction?.slice(1) ===
                            "Not_interested"
                              ? "Not Interested"
                              : reaction?.charAt(0)?.toUpperCase() +
                                reaction?.slice(1)
                          }
                        >
                          {reactionIcons[reaction]}
                        </Tooltip>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center space-x-2">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-600"
            >
              <path
                d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3ZM12 17H14C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className="font-semibold">
              {formatPostReactionNumber(post?.comments?.length || 0)}
            </span>
          </div>

          {post?.itinerary && (
            <div className="flex items-center space-x-2 cursor-pointer">
              <CalendarCheck className="size-6 text-gray-600" />
              <span className="font-semibold">
                {formatPostReactionNumber(post?.itineraryViewCount || 0)}
              </span>
            </div>
          )}
        </div>
      </div>

      <PostCommentInput
        post={post}
        setAllPosts={setAllPosts} // Pass setAllPosts for comment updates
        editCommentId={editCommentId}
        editCommentText={editCommentText}
        setEditCommentId={setEditCommentId}
        setEditCommentText={setEditCommentText}
      />

      <PostCommentSection
        post={post}
        setAllPosts={setAllPosts} // Pass setAllPosts for comment updates
        onEdit={handleEdit}
        setShowPostDetails={setShowPostDetails}
      />

      <PostDetails
        post={post}
        isOpen={showPostDetails}
        onClose={() => setShowPostDetails(false)}
      />

      {post?.itinerary && (
        <ShowItineraryModal
          itinerary={post?.itinerary}
          visible={showItineraryModal}
          onClose={() => setShowItineraryModal(false)}
        />
      )}

      {showPostEditModal && (
        <PostEditModal
          isOpen={showPostEditModal}
          onClose={() => setShowPostEditModal(false)}
          post={post}
          onPostUpdated={handlePostUpdated}
        />
      )}
    </div>
  );
};

export default PostCard;
