"use client";
import { IComment, IPost } from "@/types/post.types";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import useUser from "@/hooks/useUser";
import { BsThreeDots } from "react-icons/bs";
import { Send, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import {
  useAddOrRemoveCommentReactionMutation,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "@/redux/features/post/postApi";
import { TError } from "@/types/error";
import toast from "react-hot-toast";
import ReportModal, { ReportType } from "@/components/custom/ReportModal";
import { openAuthModal } from "@/redux/features/auth/authModalSlice";
import { useAppDispatch } from "@/redux/hooks";
import Link from "next/link";
import { IUser } from "@/types/user.types";
import formatTimeAgo from "@/utils/formatTimeAgo";

interface PostCommentSectionProps {
  post: IPost;
  onEdit?: (commentId: string, commentText: string) => void;
  setShowPostDetails?: (value: boolean) => void;
  isViewAllComments?: boolean;
}

interface CommentItemProps {
  comment: IComment;
  post: IPost;
  user: IUser | null;
  currentUserId: string;
  level: number;
  onEdit?: (commentId: string, commentText: string) => void;
  onReply: (
    parentId: string,
    replyToUserId: string,
    replyToUsername: string
  ) => void;
  onReaction: (postId: string, commentId: string, reactionType: string) => void;
  onDelete: (commentId: string) => void;
  onReport: () => void;
}

// Single Comment Component with nested replies support
const CommentItem = ({
  comment,
  post,
  user,
  currentUserId,
  level,
  onEdit,
  onReply,
  onReaction,
  onDelete,
  onReport,
}: CommentItemProps) => {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const isReactionAdded = comment?.reactions?.some(
    (r) => r?.userId?._id === user?._id
  );

  // Get direct replies for this comment
  const directReplies =
    post?.comments?.filter(
      (c) => c?.parentCommentId?.toString() === comment?._id.toString()
    ) || [];

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Render comment text with @mentions
  const renderCommentText = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) =>
      part.match(/@\w+/) ? (
        <Link
          key={index}
          href={`/${part.slice(1)}`}
          className="text-blue-600 font-medium"
        >
          {part}
        </Link>
      ) : (
        part
      )
    );
  };

  // Calculate margin for nested levels (max 6 levels deep)
  const getNestedMargin = (level: number) => {
    const maxLevel = Math.min(level, 6);
    return `ml-${Math.min(maxLevel * 8, 48)}`; // Max ml-48
  };

  // Show connection line for nested comments
  const showConnectionLine = level > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className={`mb-3 ${level > 0 ? getNestedMargin(1) : ""} relative`}
    >
      {/* Connection line for nested comments */}
      {showConnectionLine && (
        <div className="absolute left-[-20px] top-0 w-4 h-8 border-l-2 border-b-2 border-gray-200 rounded-bl-lg"></div>
      )}

      <div className="flex items-start space-x-3">
        {comment?.userId?.profileImage && (
          <Link href={`/${comment?.userId?.username}`}>
            <Image
              src={comment?.userId?.profileImage}
              alt={comment?.userId?.fullName || "User"}
              width={level > 2 ? 28 : 36}
              height={level > 2 ? 28 : 36}
              className={`${
                level > 2 ? "w-7 h-7" : "w-9 h-9"
              } rounded-full object-cover border border-gray-300 hover:border-gray-400 transition-colors`}
            />
          </Link>
        )}

        <div className="flex-1 min-w-0">
          {/* Comment bubble */}
          <div className="w-fit bg-gray-100/70 px-3 py-2 rounded-2xl max-w-full">
            <Link href={`/${comment?.userId?.username}`}>
              <p className="text-sm md:text-base font-medium text-gray-800 hover:underline">
                {comment?.userId?.fullName}
              </p>
            </Link>
            <p className="text-gray-700 break-words max-w-full mt-1 text-sm md:text-base">
              {renderCommentText(comment?.comment)}
            </p>
          </div>

          {/* Comment actions */}
          <div className="w-full md:w-fit flex items-center space-x-4 mt-2 ml-1 text-gray-500 relative text-xs ">
            {/* Like button */}
            <button
              onClick={() => onReaction(post?._id, comment?._id, "love")}
              className={`hover:text-rose-500 transition-colors flex items-center space-x-1 cursor-pointer ${
                isReactionAdded ? "text-rose-500" : "text-gray-500"
              }`}
            >
              <FaHeart size={14} />
            </button>

            {/* Like count */}
            {comment?.reactions?.length > 0 && (
              <span className="text-gray-500 text-xs">
                {comment?.reactions?.length}{" "}
                {comment?.reactions?.length === 1 ? "like" : "likes"}
              </span>
            )}

            {/* Reply button */}
            <button
              onClick={() =>
                onReply(
                  level === 0
                    ? comment?._id
                    : comment?.parentCommentId || comment?._id,
                  comment?.userId?._id,
                  comment?.userId?.username
                )
              }
              className="hover:text-gray-700 transition-colors text-xs font-medium cursor-pointer"
            >
              Reply
            </button>

            {/* Time ago (you can add actual time calculation) */}
            <span className="text-gray-400 text-xs">
              {/* Add your time formatting logic here */}
              {formatTimeAgo(comment?.createdAt)}
            </span>

            {/* Menu button */}
            <button
              onClick={() =>
                setMenuOpenId(menuOpenId === comment?._id ? null : comment?._id)
              }
              className="hover:text-gray-700 transition-colors cursor-pointer"
            >
              <BsThreeDots size={18} />
            </button>

            {/* Dropdown menu */}
            {menuOpenId === comment?._id && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute ${
                  comment?.userId?._id === currentUserId
                    ? "-right-40 -top-14"
                    : "-right-40 -top-7"
                } w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-20 cursor-pointer`}
              >
                {comment?.userId?._id === currentUserId ? (
                  <>
                    <button
                      onClick={() => {
                        onEdit?.(comment?._id, comment?.comment);
                        setMenuOpenId(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-50 transition-colors rounded-t-xl"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete(comment?._id);
                        setMenuOpenId(null);
                      }}
                      className="w-full text-left px-4 py-2 cursor-pointer text-sm text-red-600 hover:bg-gray-50 transition-colors rounded-b-xl"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onReport();
                      setMenuOpenId(null);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors rounded-xl cursor-pointer"
                  >
                    Report
                  </button>
                )}
              </motion.div>
            )}
          </div>

          {/* Show/Hide replies toggle for comments with replies */}
          {directReplies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="ml-1 mt-2 text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center space-x-1 cursor-pointer"
            >
              <span>
                {showReplies ? "Hide" : "View"} {directReplies.length}{" "}
                {directReplies.length === 1 ? "reply" : "replies"}
              </span>
            </button>
          )}

          {/* Nested replies */}
          {showReplies && directReplies.length > 0 && (
            <div className="mt-3">
              <AnimatePresence>
                {directReplies.map((reply) => (
                  <CommentItem
                    key={reply._id}
                    comment={reply}
                    post={post}
                    user={user}
                    currentUserId={currentUserId}
                    level={level + 1}
                    onEdit={onEdit}
                    onReply={onReply}
                    onReaction={onReaction}
                    onDelete={onDelete}
                    onReport={onReport}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Reply Input Component
const ReplyInput = ({
  isOpen,
  replyText,
  setReplyText,
  onSubmit,
  user,
  placeholder = "Write a reply...",
}: {
  isOpen: boolean;
  replyText: string;
  setReplyText: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  user: IUser | null;
  placeholder?: string;
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Handle emoji selection
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setReplyText(replyText + emojiData.emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = (replyText + emojiData.emoji).length;
      textareaRef.current.setSelectionRange(length, length);
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (isOpen && replyText && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.focus();
      const length = replyText.length;
      textarea.setSelectionRange(length, length);
    }
  }, [isOpen, replyText]);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {replyText && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="mt-3 ml-12"
        >
          <div className="flex space-x-2">
            {user?.profileImage && (
              <Image
                src={user?.profileImage}
                alt="Your Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border border-gray-300"
              />
            )}
            <div className="flex-1 relative">
              <div
                className={`w-full relative flex ${
                  replyText
                    ? "flex-col items-end"
                    : "flex-row gap-2 justify-between"
                } bg-gray-100 rounded-xl`}
              >
                <textarea
                  ref={textareaRef}
                  placeholder={placeholder}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{ minHeight: "20px", height: "auto" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSubmit();
                    }
                  }}
                  className="w-full px-4 py-2 bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none resize-none rounded-xl"
                />
                <div className="flex items-center gap-3 p-2">
                  {replyText && (
                    <button
                      onClick={onSubmit}
                      className="text-primary  font-medium text-sm"
                    >
                      <Send size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <Smile size={18} />
                  </button>
                </div>
              </div>

              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute right-0 bottom-14 z-30"
                >
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    theme={Theme.LIGHT}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

// Main Component
const PostCommentSection = ({ post, onEdit }: PostCommentSectionProps) => {
  const user = useUser();
  const currentUserId = user?._id;
  const dispatch = useAppDispatch();

  // Reply state
  const [replyInputOpen, setReplyInputOpen] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [replyToUserId, setReplyToUserId] = useState<string>("");
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // API hooks
  const [replyComment] = useCreateCommentMutation();
  const [addOrRemoveCommentReaction] = useAddOrRemoveCommentReactionMutation();
  const [deleteComment] = useDeleteCommentMutation();

  // Get top-level comments only
  const topLevelComments =
    post?.comments?.filter((c) => !c.parentCommentId) || [];

  // Handle reply submission
  const handleReplySubmit = async () => {
    if (replyText.trim() !== "" && replyInputOpen && replyToUserId) {
      try {
        const payload = {
          comment: replyText,
          postId: post._id,
          parentCommentId: replyInputOpen,
          replyTo: replyToUserId,
        };
        await replyComment(payload).unwrap();
        setReplyText("");
        setReplyInputOpen(null);
        setReplyToUserId("");
        toast.success("Reply posted!");
      } catch (error) {
        const err = error as TError;
        toast.error(err?.data?.message || "Something went wrong!");
      }
    }
  };

  // Handle reply cancel
  const handleReplyCancel = () => {
    setReplyText("");
    setReplyInputOpen(null);
    setReplyToUserId("");
  };

  // Handle starting a reply
  const handleReply = (
    parentId: string,
    replyToUserId: string,
    replyToUsername: string
  ) => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }
    setReplyInputOpen(parentId);
    setReplyToUserId(replyToUserId);
    setReplyText(`@${replyToUsername} `);
  };

  // Handle comment reaction
  const handleCommentReaction = async (
    postId: string,
    commentId: string,
    reactionType: string
  ) => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }

    try {
      const payload = { postId, commentId, reactionType };
      await addOrRemoveCommentReaction(payload).unwrap();
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      const payload = { commentId, postId: post?._id };
      await deleteComment(payload).unwrap();
      toast.success("Comment deleted successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Handle report
  const handleReport = () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }
    setIsReportModalOpen(true);
  };

  return (
    <section className="mt-4">
      <AnimatePresence>
        {topLevelComments?.map((comment: IComment) => (
          <div key={comment?._id}>
            <CommentItem
              comment={comment}
              post={post}
              user={user}
              currentUserId={currentUserId || ""}
              level={0}
              onEdit={onEdit}
              onReply={handleReply}
              onReaction={handleCommentReaction}
              onDelete={handleDeleteComment}
              onReport={handleReport}
            />
          </div>
        ))}
      </AnimatePresence>

      {/* Reply Input */}
      <ReplyInput
        isOpen={!!replyInputOpen}
        replyText={replyText}
        setReplyText={setReplyText}
        onSubmit={handleReplySubmit}
        onCancel={handleReplyCancel}
        user={user}
      />

      {/* View all comments button */}
      {/* {post?.media?.length > 0 &&
        isViewAllComments &&
        post?.comments?.length > 4 && (
          <div className="flex justify-center items-center my-4">
            <button
              onClick={() => setShowPostDetails?.(true)}
              className="text-blue-600 text-base font-medium hover:underline"
            >
              View all {post?.comments?.length} comments
            </button>
          </div>
        )} */}

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportType={ReportType.COMMENT}
        reportedUserId={post?.userId?._id || ""}
        reportedEntityId=""
      />
    </section>
  );
};

export default PostCommentSection;
