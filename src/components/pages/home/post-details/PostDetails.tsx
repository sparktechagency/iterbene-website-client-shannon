import CustomModal from "@/components/custom/custom-modal";
import {
  IPost,
  IReaction,
  ISortedReaction,
  ReactionType,
} from "@/types/post.types";
import React, { JSX, useState } from "react";
import PostDetailsContentRender from "./PostDetailsContentRender";
import { FaBan, FaCalendarCheck, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineLuggage } from "react-icons/md";
import { FaFaceSmile } from "react-icons/fa6";
import { useAddOrRemoveReactionMutation } from "@/redux/features/post/postApi";
import useUser from "@/hooks/useUser";
import { TError } from "@/types/error";
import toast from "react-hot-toast";
import { Tooltip } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import PostDetailsHeader from "./PostDetailsHeader";
import PostCommentInput from "../posts/post.comment.input";
import PostCommentSection from "../posts/post.comment.section";
import formatPostReactionNumber from "@/utils/formatPostReactionNumber";

interface PostDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  post: IPost;
}
const PostDetails = ({ isOpen, onClose, post }: PostDetailsProps) => {
  const user = useUser();
  const currentUserId = user?._id;
  const [showReactions, setShowReactions] = useState<boolean>(false);
  const userReaction = post?.reactions?.find(
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
  return (
    <CustomModal
      maxWidth="max-w-6xl"
      isOpen={isOpen}
      onClose={onClose}
      header={null}
      maxHeight="max-h-[80vh] md:max-h-[90vh]"
    >
      <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="w-full h-full  col-span-full md:col-span-8">
          <PostDetailsContentRender medias={post?.media} />
        </div>
        <div className="w-full h-full max-h-[66vh] overflow-y-auto col-span-full md:col-span-4">
          <PostDetailsHeader post={post} onClose={onClose} />
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
          {/* Show reactions summary */}
          <div className="mt-5">
            {nonZeroReactions?.length > 0 && (
              <div className="relative mb-2 mt-2">
                <div className="w-fit flex items-center gap-1 cursor-pointer">
                  <div className="flex -space-x-1 cursor-pointer ">
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
                    {formatPostReactionNumber(post?.reactions?.length || 0)}
                  </span>
                </div>
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
                        className={`${
                          reactionColors[userReaction.reactionType]
                        }`}
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
                                reaction.charAt(0).toUpperCase() +
                                reaction.slice(1)
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
          <PostCommentInput post={post} />
          <PostCommentSection post={post} isViewAllComments={false} />
        </div>
      </section>
    </CustomModal>
  );
};

export default PostDetails;
