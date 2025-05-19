"use client";
import { IComment, IPost } from "@/types/post.types";
import { Ban, Heart, Smile } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaCalendarCheck, FaHeart } from "react-icons/fa";
import { MdOutlineLuggage } from "react-icons/md";
import { RiMessage2Fill } from "react-icons/ri";
import PostCommentInput from "./post.comment.input";
import PostCommentSection from "./post.comment.section";
import PostContentRender from "./post.content-render";
import PostHeader from "./post.header";
interface PostCardProps {
  post: IPost;
}

const PostCard = ({ post }: PostCardProps) => {
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
    setComments([...comments, comment]);
    setNewComment("");
  };

  const handleReaction = (reactionType: keyof typeof reactions) => {};

  const sortedReactions = Object.entries(reactions);

  // Close modal on outside click
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowDescription(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl p-4 mb-4">
      <PostHeader post={post} />
      <p className="text-gray-700 mb-4">{post?.content}</p>
      <PostContentRender
        setShowDescription={setShowDescription}
        data={post.media || []}
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
