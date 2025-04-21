"use client";
import { IComment, IPost } from "@/types/post.types";
import { motion } from "framer-motion";
import { Ban, Heart, Smile } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaCalendarCheck, FaHeart } from "react-icons/fa";
import { MdOutlineLuggage } from "react-icons/md";
import { RiMessage2Fill } from "react-icons/ri";
import PostDescriptionContentRender from "./post-description-content-render";
import PostCommentInput from "./post.comment.input";
import PostCommentSection from "./post.comment.section";
import PostContentRender from "./post.content-render";
import PostHeader from "./post.header";
interface PostCardProps {
  post: IPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [reactions, setReactions] = useState(post.reactions);
  const [newComment, setNewComment] = useState<string>("");
  const [comments, setComments] = useState<IComment[]>(post.comments);
  const [showReactions, setShowReactions] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState<boolean>(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showDescription) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDescription]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: IComment = {
      id: `c${comments.length + 1}`,
      username: "Current User",
      profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
      text: newComment,
      timestamp: "Just now",
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const handleReaction = (reactionType: keyof typeof reactions) => {
    setReactions((prev) => ({
      ...prev,
      [reactionType]: prev[reactionType] + 1,
    }));
  };

  const sortedReactions = Object.entries(reactions)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  // Close modal on outside click
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowDescription(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl p-4 mb-4">
      <PostHeader post={post} />
      <p className="text-gray-700 mb-4">{post.content.text}</p>
      <PostContentRender
        setShowDescription={setShowDescription}
        data={post.content.media || []}
      />
      <div className="flex gap-7 items-center mt-5 border-b border-[#9194A9] pt-8 pb-5">
        <div
          className="relative flex items-center"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <button className="text-gray-600 flex gap-2 items-center cursor-pointer">
            <FaHeart className="size-6 text-secondary" />
            {sortedReactions.length > 0
              ? sortedReactions[0][0].charAt(0).toUpperCase() +
                sortedReactions[0][0].slice(1)
              : ""}
          </button>
          {showReactions && (
            <div className="absolute -top-12 -left-2 bg-white border border-gray-50 rounded-full shadow-lg px-3 py-2 flex space-x-3">
              <button
                title="Like"
                onClick={() => handleReaction("love")}
                className="text-2xl text-gray-600 hover:scale-125 hover:text-secondary transition-transform cursor-pointer"
              >
                <Heart size={28} />
              </button>
              <button
                title="Luggage"
                onClick={() => handleReaction("luggage")}
                className="text-2xl text-gray-600 hover:scale-125 hover:text-secondary transition-transform cursor-pointer"
              >
                <MdOutlineLuggage size={28} />
              </button>
              <button
                title="Ban"
                onClick={() => handleReaction("ban")}
                className="text-2xl text-gray-600 hover:scale-125 hover:text-secondary transition-transform cursor-pointer"
              >
                <Ban size={24} />
              </button>
              <button
                title="Smile"
                onClick={() => handleReaction("smile")}
                className="text-2xl text-gray-600 hover:scale-125 hover:text-secondary transition-transform cursor-pointer"
              >
                <Smile size={24} />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <RiMessage2Fill className="size-6 text-primary" />
          <span className="font-semibold">{comments.length}</span>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <FaCalendarCheck className="h-5 w-5 text-primary" />
          <span className="font-semibold">{post.shares}</span>
        </div>
      </div>

      <PostCommentInput
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
      />
      <PostCommentSection comments={comments} />

      {showDescription && (
        <div
          className="fixed inset-0 bg-gray-900/50 flex justify-center items-center z-50 transition-opacity duration-300"
          onClick={handleOutsideClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-7xl max-h-[800px] bg-white p-8 rounded-xl grid grid-cols-2 gap-5 shadow-xl"
          >
            <div className="overflow-y-auto">
              <PostHeader post={post} />
              <p className="text-gray-700 mb-4">{post.content.text}</p>
              <PostDescriptionContentRender data={post.content.media || []} />
            </div>
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center border-b border-[#9194A9]">
                <div className="flex gap-7 items-center pt-5 pb-5">
                  <div
                    className="relative flex items-center"
                    onMouseEnter={() => setShowReactions(true)}
                    onMouseLeave={() => setShowReactions(false)}
                  >
                    <button className="text-gray-600 flex gap-2 items-center cursor-pointer">
                      <FaHeart className="size-6 text-primary" />
                      {sortedReactions.length > 0
                        ? sortedReactions[0][0].charAt(0).toUpperCase() +
                          sortedReactions[0][0].slice(1)
                        : ""}
                    </button>
                    {showReactions && (
                      <div className="absolute -top-12 -left-2 bg-white border rounded-full shadow-lg px-3 py-2 flex space-x-3">
                        <button
                          onClick={() => handleReaction("love")}
                          className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                        >
                          ❤️
                        </button>
                        <button
                          onClick={() => handleReaction("luggage")}
                          className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                        >
                          <MdOutlineLuggage size={28} />
                        </button>
                        <button
                          onClick={() => handleReaction("ban")}
                          className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Ban size={24} />
                        </button>
                        <button
                          onClick={() => handleReaction("smile")}
                          className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Smile size={24} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <RiMessage2Fill className="size-6 text-primary" />
                    <span className="font-semibold">{comments.length}</span>
                  </div>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <FaCalendarCheck className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{post.shares}</span>
                  </div>
                </div>
                <button
                  className="bg-amber-200 px-4 py-2 rounded"
                  onClick={() => setShowDescription(false)}
                >
                  Close
                </button>
              </div>
              <div className="flex-1  max-h-[500px] overflow-y-auto">
                <PostCommentSection comments={comments} />
              </div>
              <PostCommentInput
                newComment={newComment}
                setNewComment={setNewComment}
                handleAddComment={handleAddComment}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
