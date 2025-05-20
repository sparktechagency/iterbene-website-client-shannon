"use client";
import useUser from "@/hooks/useUser";
import { useAddOrRemoveReactionMutation } from "@/redux/features/post/postApi";
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
import PostCommentInput from "./post.comment.input";
import PostCommentSection from "./post.comment.section";
import PostContentRender from "./post.content-render";
import PostHeader from "./post.header";
import CustomModal from "@/components/custom/custom-modal";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";

interface PostCardProps {
  post: IPost;
}

// Utility function to format numbers (e.g., 1000 → 1k, 1100 → 1.1k, 41500 → 41.5k, 1000000 → 1m)
const formatNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num >= 1000 && num < 1000000) {
    const value = (num / 1000).toFixed(1);
    return value.endsWith(".0") ? `${Math.floor(num / 1000)}k` : `${value}k`;
  }
  if (num >= 1000000) {
    const value = (num / 1000000).toFixed(1);
    return value.endsWith(".0") ? `${Math.floor(num / 1000000)}m` : `${value}m`;
  }
  return num.toString();
};

const PostCard = ({ post }: PostCardProps) => {
  const user = useUser();
  const currentUserId = user?._id;
  const [showReactions, setShowReactions] = useState<boolean>(false);
  const [showReactionDetails, setShowReactionDetails] =
    useState<boolean>(false);

  // Find the user's reaction, if any
  const userReaction = post.reactions?.find(
    (reaction: IReaction) => reaction?.userId?._id === currentUserId
  );

  // Get reactions with non-zero counts
  const nonZeroReactions = post?.sortedReactions?.filter(
    (reaction: ISortedReaction) => reaction?.count > 0
  );

  // Add or remove reactions
  const [addOrRemoveReaction] = useAddOrRemoveReactionMutation();

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

  const handleReaction = async (reactionType: string) => {
    try {
      await addOrRemoveReaction({ postId: post._id, reactionType }).unwrap();

      setShowReactions(false);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Get the primary reaction to display (the one with highest count)
  // const primaryReaction =
  //   nonZeroReactions && nonZeroReactions.length > 0
  //     ? nonZeroReactions.reduce((prev, current) =>
  //         current.count > prev.count ? current : prev
  //       )
  //     : null;

  return (
    <div className="w-full bg-white rounded-xl p-4 mb-4 relative">
      <PostHeader post={post} />
      <p className="text-gray-700 mb-4">
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
      <PostContentRender data={post.media || []} />

      {/* Show reactions summary */}
      {nonZeroReactions?.length > 0 && (
        <div className="relative mb-2 mt-2">
          <div className="flex items-center gap-1">
            <div
              onClick={() => setShowReactionDetails(true)}
              className="flex -space-x-1 cursor-pointer "
            >
              {/* Show up to 3 reaction types */}
              {nonZeroReactions.slice(0, 3).map((reaction) => (
                <div key={reaction.type}>
                  <span className={`${reactionColors[reaction.type]}`}>
                    {reactionIcons[reaction.type]}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-[18px] hover:underline cursor-pointer font-semibold text-gray-500 ">
              {formatNumber(post?.reactions?.length || 0)}
            </span>
          </div>

          {/* Reaction details popup */}
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
          >
            {post?.reactions?.length > 0 && (
              <div className="w-full space-y-2 ">
                {post?.reactions?.map((reaction) => (
                  <div key={reaction.userId._id}>
                    <div className="flex justify-between items-center gap-2 border-b border-gray-200 pb-1">
                      <div className="flex items-center gap-3">
                        <Image
                          src={reaction?.userId?.profileImage}
                          alt="avatar"
                          width={40}
                          height={40}
                          className="size-[40px] rounded-full"
                        />
                        <div className="flex flex-col  mt-2">
                          <h1 className="font-semibold">
                            {reaction?.userId?.fullName}
                          </h1>
                          <span className="text-gray-500">
                            {reaction?.userId?.username}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`${reactionColors[reaction?.reactionType]}`}
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
                  className={`font-semibold capitalize  ${
                    reactionColors[userReaction.reactionType]
                  }`}
                >
                  <span> {userReaction.reactionType}</span>
                </span>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <FaRegHeart size={23} className=" text-gray-500" />
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
                className="absolute -top-12 -left-2 bg-white border border-gray-50 rounded-full shadow-lg px-3 py-2 flex space-x-3 z-10"
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
            {formatNumber(post?.comments?.length || 0)}
          </span>
        </div>
        {post?.itinerary && (
          <div className="flex items-center space-x-2 cursor-pointer">
            <FaCalendarCheck className="h-5 w-5 text-primary" />
            <span className="font-semibold">
              {formatNumber(post?.itineraryViewCount)}
            </span>
          </div>
        )}
      </div>

      <PostCommentInput />
      <PostCommentSection comments={post?.comments} />
    </div>
  );
};

export default PostCard;
