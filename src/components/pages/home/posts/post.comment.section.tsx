"use client";
import { IComment, IPost } from "@/types/post.types";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import useUser from "@/hooks/useUser";
import { BsThreeDots } from "react-icons/bs";
import { Send, Smile } from "lucide-react";
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
import CustomEmojiPicker from "@/components/ui/CustomEmojiPicker";

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
  replyInputOpen: string | null;
  replyText: string;
  setReplyText: (text: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
}

// Reply Input Component (unchanged)
const ReplyInput = ({
  isOpen,
  replyText,
  setReplyText,
  onSubmit,
  onCancel,
  user,
  placeholder = "Write a reply...",
  level = 0,
}: {
  isOpen: boolean;
  replyText: string;
  setReplyText: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  user: IUser | null;
  placeholder?: string;
  level?: number;
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleEmojiSelect = (emoji: string) => {
    setReplyText(replyText + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = (replyText + emoji).length;
      textareaRef.current.setSelectionRange(length, length);
    }
  };

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.focus();
      if (replyText) {
        const length = replyText.length;
        textarea.setSelectionRange(length, length);
      }
    }
  }, [isOpen, replyText]);

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

  const getNestedMargin = (level: number) => {
    const maxLevel = Math.min(level, 6);
    return `ml-${Math.min(maxLevel * 8, 48)}`;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className={`mt-3 ${level > 0 ? getNestedMargin(1) : ""} relative`}
    >
      {level > 0 && (
        <div className="absolute left-[-20px] top-0 w-4 h-full border-l-2 border-gray-200"></div>
      )}

      <div className="flex space-x-3">
        {user?.profileImage && (
          <Image
            src={user?.profileImage}
            alt="Your Profile"
            width={level > 2 ? 28 : 32}
            height={level > 2 ? 28 : 32}
            className={`${
              level > 2 ? "w-7 h-7" : "w-8 h-8"
            } rounded-full object-cover border border-gray-300`}
          />
        )}
        <div className="flex-1 relative">
          <div className="w-full relative flex flex-col bg-gray-100 rounded-xl">
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
                } else if (e.key === "Escape") {
                  onCancel();
                }
              }}
              className="w-full px-4 py-2 bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none resize-none rounded-xl"
            />
            <div className="flex items-center justify-between gap-3 px-4 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onCancel}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <Smile size={18} />
                </button>
                <button
                  onClick={onSubmit}
                  disabled={!replyText.trim()}
                  className={`font-medium text-sm cursor-pointer ${
                    replyText.trim()
                      ? "text-primary hover:text-primary/80"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute right-0 bottom-full mb-2 z-50"
            >
              <CustomEmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
                position="top"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Single Comment Component with optimistic updates
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
  replyInputOpen,
  replyText,
  setReplyText,
  onSubmitReply,
  onCancelReply,
}: CommentItemProps) => {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isReactionAdded = comment?.reactions?.some(
    (r) => r?.userId?._id === user?._id
  );

  const directReplies =
    post?.comments?.filter(
      (c) => c?.parentCommentId?.toString() === comment?._id.toString()
    ) || [];

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

  const getNestedMargin = (level: number) => {
    const maxLevel = Math.min(level, 6);
    return `ml-${Math.min(maxLevel * 8, 48)}`;
  };

  const showConnectionLine = level > 0;
  const showReplyInput = replyInputOpen === comment?._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className={`mb-3 ${level > 0 ? getNestedMargin(1) : ""} relative`}
    >
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

          <div className="w-full md:w-fit flex items-center space-x-4 mt-2 ml-1 text-gray-500 relative text-xs">
            <button
              onClick={() => onReaction(post?._id, comment?._id, "love")}
              className={`hover:text-rose-500 transition-colors flex items-center space-x-1 cursor-pointer ${
                isReactionAdded ? "text-rose-500" : "text-gray-500"
              }`}
            >
              <FaHeart size={14} />
            </button>

            {comment?.reactions?.length > 0 && (
              <span className="text-gray-500 text-xs">
                {comment?.reactions?.length}{" "}
                {comment?.reactions?.length === 1 ? "like" : "likes"}
              </span>
            )}

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

            <span className="text-gray-400 text-xs">
              {formatTimeAgo(comment?.createdAt)}
            </span>

            <button
              onClick={() =>
                setMenuOpenId(menuOpenId === comment?._id ? null : comment?._id)
              }
              className="hover:text-gray-700 transition-colors cursor-pointer"
            >
              <BsThreeDots size={18} />
            </button>

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

          {showReplyInput && (
            <ReplyInput
              isOpen={showReplyInput}
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmit={onSubmitReply}
              onCancel={onCancelReply}
              user={user}
              level={level}
              placeholder={`Reply to ${comment?.userId?.fullName}...`}
            />
          )}

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
                    replyInputOpen={replyInputOpen}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    onSubmitReply={onSubmitReply}
                    onCancelReply={onCancelReply}
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

// Main Component with optimistic updates
const PostCommentSection = ({ post, onEdit }: PostCommentSectionProps) => {
  const user = useUser();
  const currentUserId = user?._id;
  const dispatch = useAppDispatch();

  const [replyInputOpen, setReplyInputOpen] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [replyToUserId, setReplyToUserId] = useState<string>("");
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // API hooks - optimistic updates are handled in the API layer
  const [replyComment] = useCreateCommentMutation();
  const [addOrRemoveCommentReaction] = useAddOrRemoveCommentReactionMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const topLevelComments =
    post?.comments?.filter((c) => !c.parentCommentId) || [];

  const handleReplySubmit = async () => {
    if (replyText.trim() !== "" && replyInputOpen && replyToUserId) {
      try {
        const payload = {
          comment: replyText,
          postId: post._id,
          parentCommentId: replyInputOpen,
          replyTo: replyToUserId,
        };
        // Optimistic update will handle UI changes automatically
        await replyComment(payload).unwrap();
        setReplyText("");
        setReplyInputOpen(null);
        setReplyToUserId("");
        toast.success("Reply posted!");
      } catch (error) {
        const err = error as TError;
        toast.error(err?.data?.message || "Something went wrong!");
        // Optimistic update will automatically revert on error
      }
    }
  };

  const handleReplyCancel = () => {
    setReplyText("");
    setReplyInputOpen(null);
    setReplyToUserId("");
  };

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

  // Simplified comment reaction handler - optimistic updates handle UI
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
      // Optimistic update will handle UI changes automatically
      await addOrRemoveCommentReaction(payload).unwrap();
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
      // Optimistic update will automatically revert on error
    }
  };

  // Simplified delete handler - optimistic updates handle UI
  const handleDeleteComment = async (commentId: string) => {
    try {
      const payload = { commentId, postId: post?._id };
      // Optimistic update will remove comment from UI immediately
      await deleteComment(payload).unwrap();
      toast.success("Comment deleted successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
      // Optimistic update will automatically revert on error
    }
  };

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
              replyInputOpen={replyInputOpen}
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmitReply={handleReplySubmit}
              onCancelReply={handleReplyCancel}
            />
          </div>
        ))}
      </AnimatePresence>

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
