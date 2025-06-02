"use client";
import { IComment } from "@/types/post.types";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import useUser from "@/hooks/useUser";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { BsThreeDots } from "react-icons/bs";
import { Send, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

const PostCommentSection = ({ comments }: { comments: IComment[] }) => {
  const user = useUser();
  const currentUserId = user?._id;
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [replyInputOpen, setReplyInputOpen] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Handle reply button click, setting the username in the reply input
  const handleReplyClick = (commentId: string, username: string) => {
    const newReplyInputOpen = replyInputOpen === commentId ? null : commentId;
    setReplyInputOpen(newReplyInputOpen);
    setReplyText(newReplyInputOpen === commentId ? `@${username} ` : "");
    setShowEmojiPicker(false);
  };

  // Handle reply submission
  const handleReplySubmit = async (parentCommentId: string) => {
    if (replyText.trim()) {
      console.log("Submitting reply:", replyText, "to", parentCommentId);
      // Reset state after submission
      setReplyText("");
      setReplyInputOpen(null);
      setShowEmojiPicker(false);
      if (replyInputRef.current) {
        replyInputRef.current.focus();
      }
    }
  };

  // Handle reply cancel
  const handleReplyCancel = () => {
    setReplyText("");
    setReplyInputOpen(null);
    setShowEmojiPicker(false);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setReplyText(replyText + emojiData.emoji);
    if (replyTextareaRef.current) {
      replyTextareaRef.current.focus();
      const length = (replyText + emojiData.emoji).length;
      replyTextareaRef.current.setSelectionRange(length, length);
    } else if (replyInputRef.current) {
      replyInputRef.current.focus();
    }
  };

  // Close 3-dot menu and emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
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

  // Auto-resize textarea and set cursor to end
  useEffect(() => {
    if (replyInputOpen && replyText && replyTextareaRef.current) {
      const textarea = replyTextareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.focus();
      const length = replyText.length;
      textarea.setSelectionRange(length, length);
    }
  }, [replyInputOpen, replyText]);

  // Group top-level comments and their replies
  const topLevelComments = comments?.filter((c) => !c.replyTo);
  const getReplies = (parentId: string) =>
    comments?.filter((c) => c.replyTo?.toString() === parentId);

  // Render comment with blue @username
  const renderCommentText = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) =>
      part.match(/@\w+/) ? (
        <span key={index} className="text-blue-600">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <section className="mt-4 px-3">
      <AnimatePresence>
        {topLevelComments?.slice(0, 4)?.map((comment: IComment) => (
          <div key={comment?._id} className="mb-4">
            <div className="flex items-start space-x-3 relative">
              <Image
                src={comment?.userId?.profileImage || "/default-avatar.png"}
                alt={comment?.userId?.fullName || "User"}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover border border-gray-300"
              />
              <div className="flex-1 min-w-0">
                <div className="w-fit bg-gray-100/70 px-3 py-2 rounded-2xl max-w-full">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-800">
                      {comment?.userId?.fullName}
                    </p>
                  </div>
                  <p className="text-gray-700 break-all max-w-full mt-1">
                    {renderCommentText(comment?.comment)}
                  </p>
                </div>
                <div className="w-56 flex items-center space-x-4 mt-2 ml-1 text-gray-500 text-xs relative">
                  <button className="hover:text-rose-500 transition-colors flex items-center space-x-1 cursor-pointer">
                    <FaHeart size={16} />
                  </button>
                  <button
                    onClick={() =>
                      handleReplyClick(comment._id, comment.userId.fullName)
                    }
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() =>
                      setMenuOpenId(menuOpenId === comment._id ? null : comment._id)
                    }
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    <BsThreeDots size={20} />
                  </button>
                  {menuOpenId === comment._id && (
                    <motion.div
                      ref={menuRef}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute -right-10 top-2 w-40 bg-white border border-gray-50 rounded-xl shadow-lg z-10"
                    >
                      {comment.userId?._id === currentUserId ? (
                        <>
                          <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-300 rounded-t-xl cursor-pointer">
                            Edit
                          </button>
                          <button className="w-full transition-all duration-300 text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100 rounded-b-xl cursor-pointer">
                            Delete
                          </button>
                        </>
                      ) : (
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          Report
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>
                {/* Reply Input */}
                {replyInputOpen === comment._id && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="mt-2 relative"
                  >
                    <div className="flex space-x-2 ml-8">
                      <Image
                        src={
                          currentUserId
                            ? user?.profileImage
                            : "/default-avatar.png"
                        }
                        alt="Your Profile"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover border border-gray-300"
                      />
                      <div
                        className={`w-full relative flex ${
                          replyText ? "flex-col items-end" : "flex-row  gap-2 justify-between"
                        } bg-gray-100 rounded-xl text-base`}
                      >
                        {replyText === "" ? (
                          <input
                            ref={replyInputRef}
                            type="text"
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleReplySubmit(comment._id.toString());
                              }
                            }}
                            className="w-full px-4 py-3.5 bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none rounded-full"
                          />
                        ) : (
                          <textarea
                            ref={replyTextareaRef}
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleReplySubmit(comment._id.toString());
                              }
                            }}
                            className="w-full px-4 py-2 bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none resize-none rounded-2xl"
                          />
                        )}
                        <div className="flex items-end gap-4 -mt-3 pb-4 pr-4">
                          {replyText ? (
                            <>
                              <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                              >
                                <Smile size={18} />
                              </button>
                              <button
                                onClick={() => handleReplySubmit(comment._id.toString())}
                                className="text-gray-500 hover:text-primary cursor-pointer"
                              >
                                <Send size={18} />
                              </button>
                              <button
                                onClick={() => handleReplyCancel()}
                                className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                              >
                                <Smile size={18} />
                              </button>
                              <button
                                onClick={() => handleReplyCancel()}
                                className="text-gray-500 hover:text-gray-700 text-xs cursor-pointer"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                        {/* Emoji Picker */}
                        {showEmojiPicker && (
                          <div
                            ref={emojiPickerRef}
                            className="absolute right-0 bottom-14 z-10"
                          >
                            <EmojiPicker
                              onEmojiClick={handleEmojiSelect}
                              theme={Theme.LIGHT}
                              style={{ scrollbarColor: "gray #ffffff" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            {/* Render Replies */}
            {getReplies(comment._id.toString()).length > 0 && (
              <div className="ml-12 mt-2 relative">
                <div className="absolute left-[-28px] top-0 w-4 h-full border-l-2 border-b-2 border-gray-300 rounded-bl-lg"></div>
                <AnimatePresence>
                  {getReplies(comment._id.toString()).map((reply: IComment) => (
                    <motion.div
                      key={reply?._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="mb-2"
                    >
                      <div className="flex items-start space-x-3">
                        <Image
                          src={
                            reply?.userId?.profileImage || "/default-avatar.png"
                          }
                          alt={reply?.userId?.fullName || "User"}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover border border-gray-300"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="w-fit bg-gray-100 px-3 py-2 rounded-2xl max-w-full">
                            <div className="flex justify-between items-start">
                              <p className="font-semibold text-gray-800">
                                {reply?.userId?.fullName}
                              </p>
                              <button
                                onClick={() =>
                                  setMenuOpenId(
                                    menuOpenId === reply._id ? null : reply._id
                                  )
                                }
                                className="text-gray-500 hover:text-gray-700 ml-2"
                              >
                                <BsThreeDots size={16} />
                              </button>
                            </div>
                            <p className="text-gray-700 break-all max-w-full mt-1">
                              {renderCommentText(reply?.comment)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 ml-1 text-gray-500 text-xs">
                            <button className="hover:text-blue-600 transition-colors flex items-center space-x-1">
                              <FaHeart className="w-4 h-4" />
                              <span>Like</span>
                            </button>
                            <button
                              onClick={() =>
                                handleReplyClick(reply._id, reply.userId.fullName)
                              }
                              className="hover:text-blue-600 transition-colors"
                            >
                              Reply
                            </button>
                            <span>{formatTimeAgo(reply.createdAt)}</span>
                          </div>
                          {/* Reply Input for Replies */}
                          {replyInputOpen === reply._id && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="mt-2 relative"
                            >
                              <div className="flex space-x-2 ml-6">
                                <Image
                                  src={
                                    currentUserId
                                      ? user?.profileImage
                                      : "/default-avatar.png"
                                  }
                                  alt="Your Profile"
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                                />
                                <div
                                  className={`w-full relative flex ${
                                    replyText ? "flex-col items-end" : "flex-row justify-between"
                                  } bg-gray-100 rounded-xl text-base`}
                                >
                                  {replyText === "" ? (
                                    <input
                                      ref={replyInputRef}
                                      type="text"
                                      placeholder="Write a reply..."
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                          e.preventDefault();
                                          handleReplySubmit(reply._id.toString());
                                        }
                                      }}
                                      className="w-full px-4 py-3.5 bg-transparent text-xs text-gray-800 placeholder-gray-500 focus:outline-none rounded-full"
                                    />
                                  ) : (
                                    <textarea
                                      ref={replyTextareaRef}
                                      placeholder="Write a reply..."
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                          e.preventDefault();
                                          handleReplySubmit(reply._id.toString());
                                        }
                                      }}
                                      className="w-full px-4 text-xs py-2.5 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none resize-none rounded-2xl"
                                    />
                                  )}
                                  <div className="flex items-end gap-4 -mt-3 pb-4 pr-4">
                                    {replyText ? (
                                      <>
                                        <button
                                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                          className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                        >
                                          <Smile size={18} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleReplySubmit(reply._id.toString())
                                          }
                                          className="text-gray-500 hover:text-primary cursor-pointer"
                                        >
                                          <Send size={18} />
                                        </button>
                                        <button
                                          onClick={() => handleReplyCancel()}
                                          className="text-gray-500 hover:text-gray-700 text-xs cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                          className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                        >
                                          <Smile size={18} />
                                        </button>
                                        <button
                                          onClick={() => handleReplyCancel()}
                                          className="text-gray-500 hover:text-gray-700 text-xs cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    )}
                                  </div>
                                  {/* Emoji Picker */}
                                  {showEmojiPicker && (
                                    <div
                                      ref={emojiPickerRef}
                                      className="absolute right-0 bottom-14 z-10"
                                    >
                                      <EmojiPicker
                                        onEmojiClick={handleEmojiSelect}
                                        theme={Theme.LIGHT}
                                        style={{ scrollbarColor: "gray #ffffff" }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                        {menuOpenId === reply._id && (
                          <motion.div
                            ref={menuRef}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute right-12 top-0 mt-8 w-32 bg-white border border-gray-200 rounded shadow-lg z-10"
                          >
                            {reply.userId?._id === currentUserId ? (
                              <>
                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  Edit
                                </button>
                                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                  Delete
                                </button>
                              </>
                            ) : (
                              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                Report
                              </button>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        ))}
      </AnimatePresence>
      {comments?.length > 2 && (
        <div className="flex justify-center items-center my-4">
          <button className="text-primary text-base font-medium hover:underline cursor-pointer">
            View all {comments.length} comments
          </button>
        </div>
      )}
    </section>
  );
};

export default PostCommentSection;