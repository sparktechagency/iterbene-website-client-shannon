"use client";
import { useAddOrRemoveReactionMutation } from "@/redux/features/post/postApi";
import { TError } from "@/types/error";
import { IComment, IPost } from "@/types/post.types";
import { FaFaceSmile } from "react-icons/fa6";
import { JSX, useState } from "react";
import toast from "react-hot-toast";
import { FaBan, FaCalendarCheck, FaHeart } from "react-icons/fa";
import { MdOutlineLuggage } from "react-icons/md";
import { RiMessage2Fill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import PostCommentInput from "./post.comment.input";
import PostCommentSection from "./post.comment.section";
import PostContentRender from "./post.content-render";
import PostHeader from "./post.header";

interface PostCardProps {
  post: IPost;
}

const PostCard = ({ post }: PostCardProps) => {
  const [newComment, setNewComment] = useState<string>("");
  const [comments, setComments] = useState<IComment[]>(post.comments);
  const [showReactions, setShowReactions] = useState<boolean>(false);

  // Sort reactions to get the one with the highest count
  const topReaction = post.sortedReactions?.length
    ? post.sortedReactions.reduce((prev, current) =>
        prev.count > current.count ? prev : current
      )
    : null;

  // Add or remove reactions
  const [addOrRemoveReaction] = useAddOrRemoveReactionMutation();

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, { comment: newComment } as IComment]);
    setNewComment("");
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

  // Reaction icon mapping
  const reactionIcons: { [key: string]: JSX.Element } = {
    love: <FaHeart size={24}/>,
    luggage: <MdOutlineLuggage size={28} />,
    ban: <FaBan size={24} />,
    smile: <FaFaceSmile size={24} />,
  };

  console.log(topReaction)
  return (
    <div className="w-full bg-white rounded-xl p-4 mb-4">
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
      <div className="flex gap-7 items-center mt-5 border-b border-[#9194A9] pt-8 pb-5">
        <div
          className="relative flex items-center"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <button className="text-gray-600 flex gap-2 items-center cursor-pointer">
            { post?.reactions?.length > 0 && topReaction ? (
              <>
                <span className="text-secondary">{reactionIcons[topReaction.type]}</span>
                <span className="font-semibold">{topReaction?.count}</span>
              </>
            ) : (
              <>
                <FaHeart className="size-6 text-secondary" />
                <span className="font-semibold">{post?.reactions?.length}</span>
              </>
            )}
          </button>
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -10 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute -top-12 -left-2 bg-white border border-gray-50 rounded-full shadow-lg px-3 py-2 flex space-x-3 z-10"
              >
                {["love", "luggage", "ban", "smile"].map((reaction) => (
                  <motion.button
                    key={reaction}
                    title={reaction.charAt(0).toUpperCase() + reaction.slice(1)}
                    onClick={() => handleReaction(reaction)}
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-2xl text-gray-500 hover:text-secondary cursor-pointer"
                  >
                    {reactionIcons[reaction]}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <RiMessage2Fill className="size-6 text-primary" />
          <span className="font-semibold">{comments.length}</span>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <FaCalendarCheck className="h-5 w-5 text-primary" />
          <span className="font-semibold">{post.itineraryViewCount}</span>
        </div>
      </div>

      <PostCommentInput
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
      />
      <PostCommentSection comments={comments} />
    </div>
  );
};

export default PostCard;