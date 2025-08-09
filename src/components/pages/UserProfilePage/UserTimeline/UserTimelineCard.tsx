"use client";
import useUser from "@/hooks/useUser";
import {
  useAddOrRemoveReactionMutation,
  useIncrementItineraryViewCountMutation,
} from "@/redux/features/post/postApi";
import { TError } from "@/types/error";
import {
  IPost,
  IReaction,
  ISortedReaction,
  ReactionType,
} from "@/types/post.types";
import { Tooltip } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { JSX, useState } from "react";
import toast from "react-hot-toast";
import { FaBan, FaCalendarCheck, FaHeart, FaRegHeart } from "react-icons/fa";
import { FaFaceSmile } from "react-icons/fa6";
import { MdOutlineLuggage } from "react-icons/md";
import CustomModal from "@/components/custom/custom-modal";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import UserTimelineContentRender from "./UserTimelineContentRender";
import PostHeader from "../../home/posts/post.header";
import Link from "next/link";
import formatPostReactionNumber from "@/utils/formatPostReactionNumber";
import { openAuthModal } from "@/redux/features/auth/authModalSlice";
import { useAppDispatch } from "@/redux/hooks";
import PostEditModal from "../../home/create-post/PostEditModal";
import ShowItineraryModal from "../../home/create-post/ShowItineraryModal";

interface PostCardProps {
  post: IPost;
  setTimelinePosts?: (posts: IPost[] | ((prev: IPost[]) => IPost[])) => void;
}
const UserTimelineCard = ({ post, setTimelinePosts }: PostCardProps) => {
  const user = useUser();
  const dispatch = useAppDispatch();
  const currentUserId = user?._id;
  const [showReactions, setShowReactions] = useState<boolean>(false);
  const [showReactionDetails, setShowReactionDetails] =
    useState<boolean>(false);

  const [showItineraryModal, setShowItineraryModal] = useState<boolean>(false);
  const [showPostEditModal, setShowPostEditModal] = useState<boolean>(false);

  // Find the user's reaction, if any
  const userReaction = post?.reactions?.find(
    (reaction: IReaction) => reaction?.userId?._id === currentUserId
  );

  // Get reactions with non-zero counts
  const nonZeroReactions = post?.sortedReactions?.filter(
    (reaction: ISortedReaction) => reaction?.count > 0
  );

  // Add or remove reactions
  const [addOrRemoveReaction] = useAddOrRemoveReactionMutation();
  // Itinerary
  const [incrementItinerary] = useIncrementItineraryViewCountMutation();

  // Reaction icon mapping
  const reactionIcons: { [key: string]: JSX.Element } = {
    love: <FaHeart size={23} className="text-red-500" />,
    luggage: <MdOutlineLuggage size={25} className="text-blue-500 -mt-0.5" />,
    ban: <FaBan size={23} className="text-orange-500" />,
    smile: <FaFaceSmile size={23} className="text-yellow-500" />,
  };

  // Reaction colors
  const reactionColors: { [key: string]: string } = {
    love: "text-red-500 ",
    luggage: "text-blue-500",
    ban: "text-orange-500",
    smile: "text-yellow-500",
  };

  // Update sortedReactions
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

  // handle reaction function
  const handleReaction = async (reactionType: string) => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }

    try {
      // Optimistic update: Update reactions and sortedReactions
      if (setTimelinePosts) {
        setTimelinePosts((prevPosts: IPost[]) =>
          prevPosts.map((p) => {
            if (p._id === post._id) {
              const hasReaction = p.reactions.some(
                (r) => r.userId._id === user._id
              );
              const updatedReactions = hasReaction
                ? p.reactions.filter((r) => r.userId._id !== user._id)
                : [
                    ...p.reactions,
                    {
                      userId: {
                        _id: user?._id,
                        fullName: user?.fullName,
                        username: user?.username,
                        profileImage: user?.profileImage,
                        id: user?._id,
                      },
                      postId: post._id,
                      reactionType: reactionType as ReactionType,
                      createdAt: new Date(),
                    },
                  ];
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

      await addOrRemoveReaction({ postId: post._id, reactionType }).unwrap();
      setShowReactions(false);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
      // Revert optimistic update
      if (setTimelinePosts) {
        setTimelinePosts((prevPosts: IPost[]) =>
          prevPosts.map((p) => (p?._id === post?._id ? post : p))
        );
      }
    }
  };

  // handle post updated
  const handlePostUpdated = () => {
    setShowPostEditModal(false);
  };

  // handle itinerary
  const handleItineraryClick = async () => {
    try {
      setShowItineraryModal(true);
      // handle optimistic update
      if (setTimelinePosts) {
        setTimelinePosts((prevPosts: IPost[]) =>
          prevPosts.map((p) => {
            if (p._id === post._id) {
              return {
                ...p,
                itineraryViewCount: p.itineraryViewCount + 1,
              };
            }
            return p;
          })
        );
      }
      const payload = { postId: post?._id, itineraryId: post?.itinerary?._id };
      await incrementItinerary(payload).unwrap();
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-xl p-4 mb-4 relative">
      <PostHeader
        post={post}
        onEditClick={() => setShowPostEditModal(true)}
        setAllPosts={setTimelinePosts}
      />
      <p className="text-gray-700 flex-1 mb-3">
        {post?.content?.split(/(\s+)/).map((word, index) => {
          const isHashtag = word.match(/^#\w+/);
          return (
            <span
              key={index}
              className={isHashtag ? "text-blue-500 font-bold" : ""}
            >
              {word}
            </span>
          );
        })}
      </p>

      {/* Media */}
      <UserTimelineContentRender data={post?.media || []} />

      {/* Itinerary section */}
      {post?.itinerary && (
        <div
          onClick={handleItineraryClick}
          className="px-4 py-2 mt-5 border cursor-pointer rounded-full text-gray-600 border-gray-200 flex items-center justify-between text-sm"
        >
          <span>Click to view full itinerary</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            PDF View Available
          </span>
        </div>
      )}
      {/* Reactions */}
      <div className="mt-5">
        {nonZeroReactions?.length > 0 && (
          <div className="relative mb-2 mt-2">
            <div
              onClick={() => setShowReactionDetails(true)}
              className="w-fit flex items-center gap-1 cursor-pointer"
            >
              <div className="flex -space-x-1 cursor-pointer">
                {nonZeroReactions.slice(0, 3).map((reaction) => (
                  <div key={reaction.type}>
                    <span className={`${reactionColors[reaction.type]}`}>
                      {reactionIcons[reaction.type]}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-[18px] hover:underline cursor-pointer font-semibold text-gray-500">
                {formatPostReactionNumber(post?.reactions?.length || 0)}
              </span>
            </div>
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
                    <div key={reaction.userId._id}>
                      <div className="flex justify-between items-center gap-2 border-b border-gray-200 pb-1">
                        <div className="flex items-center gap-3">
                          <Image
                            src={reaction?.userId?.profileImage}
                            alt={reaction?.userId?.fullName}
                            width={40}
                            height={40}
                            className="size-[40px] rounded-full"
                          />
                          <div className="flex flex-col mt-2">
                            <Link href={`/${reaction?.userId?.username}`}>
                              <h1 className="font-semibold hover:underline">
                                {reaction?.userId?.fullName}
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
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
          >
            <button
              className="flex gap-2 items-center cursor-pointer ml-1"
              onClick={() =>
                userReaction
                  ? handleReaction(userReaction.reactionType)
                  : handleReaction("love")
              }
            >
              {userReaction ? (
                <>
                  <span
                    className={`${reactionColors[userReaction.reactionType]}`}
                  >
                    {reactionIcons[userReaction.reactionType]}
                  </span>
                  <span
                    className={`font-semibold capitalize ${
                      reactionColors[userReaction.reactionType]
                    }`}
                  >
                    <span>{userReaction.reactionType}</span>
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1">
                  <FaRegHeart size={23} className="text-gray-500" />
                  <span className="font-semibold text-gray-500">Love</span>
                </div>
              )}
            </button>
            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -9 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute -top-12 -left-2 bg-white border border-gray-200 rounded-full shadow-lg px-3 py-2 flex space-x-3 z-10"
                >
                  {Object.keys(ReactionType).map((reactionKey) => {
                    const reaction =
                      ReactionType[
                        reactionKey as keyof typeof ReactionType
                      ].toLowerCase();
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
                            reaction.charAt(0).toUpperCase() + reaction.slice(1)
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
          <div className="flex items-center space-x-2 cursor-pointer">
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
              <FaCalendarCheck className="h-5 w-5 text-primary" />
              <span className="font-semibold">
                {formatPostReactionNumber(post?.itineraryViewCount)}
              </span>
            </div>
          )}
        </div>
      </div>
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

export default UserTimelineCard;
