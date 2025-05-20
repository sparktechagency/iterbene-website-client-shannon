"use client";
import { IComment } from "@/types/post.types";
import Image from "next/image";
import { FaHeart, FaEllipsisV } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import useUser from "@/hooks/useUser";

const PostCommentSection = ({ comments }: { comments: IComment[] }) => {
  const user = useUser();
  const currentUserId = user?._id;
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [replyInputOpen, setReplyInputOpen] = useState<string | null>(null); // Track which comment's reply input is open
  const [replyText, setReplyText] = useState(""); // Store reply text

  // Function to get relative time (e.g., "5 minutes ago")
  const getRelativeTime = (date: Date) => {
    const now = new Date("2025-05-20T17:24:00+06:00"); // Current time from system
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  // Placeholder function to handle reply submission
  const handleReplySubmit = async (parentCommentId: string) => {
    if (replyText.trim()) {
      console.log("Submitting reply:", replyText, "to", parentCommentId);
      // Reset state after submission
      setReplyText("");
      setReplyInputOpen(null);
    }
  };

  // Group top-level comments and their replies
  const topLevelComments = comments?.filter((c) => !c.replyTo);
  const getReplies = (parentId: string) =>
    comments?.filter((c) => c.replyTo?.toString() === parentId);

  return (
    <section className="mt-4 px-3">
      <AnimatePresence>
        {topLevelComments?.map((comment: IComment) => (
          <div
            key={comment?._id}
            className="mb-4"
          >
            <div className="flex items-start space-x-3 relative">
              <Image
                src={comment?.userId?.profileImage || "/default-avatar.png"}
                alt={comment?.userId?.fullName || "User"}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full object-cover border border-gray-300"
              />
              <div className="flex-1 min-w-0">
                <div className="w-fit bg-gray-100 px-3 py-2 rounded-2xl max-w-full">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-800">
                      {comment?.userId?.fullName}
                    </p>
                    <button
                      onClick={() =>
                        setMenuOpen(
                          menuOpen === comment._id ? null : comment._id
                        )
                      }
                      className="text-gray-500 hover:text-gray-700 ml-2"
                    >
                      <FaEllipsisV />
                    </button>
                  </div>
                  <p className="text-gray-700 break-all max-w-full mt-1">
                    {comment?.comment}
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-2 ml-1 text-gray-500 text-xs">
                  <button className="hover:text-blue-600 transition-colors flex items-center space-x-1">
                    <FaHeart size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setReplyInputOpen(
                        replyInputOpen === comment._id ? null : comment._id
                      )
                    }
                    className="hover:text-blue-600 transition-colors"
                  >
                    Reply
                  </button>
                  <span>{getRelativeTime(new Date(comment.createdAt))}</span>
                </div>
                {/* Reply Input */}
                {replyInputOpen === comment._id && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="mt-2 relative"
                  >
                    {/* Reply connection line */}
                    <div className="flex space-x-2 ml-12">
                      <Image
                        src={
                          currentUserId
                            ? user?.profileImage
                            : "/default-avatar.png"
                        } // Replace with current user's profile image
                        alt="Your Profile"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover border border-gray-300"
                      />
                      <div className="flex-1 relative border border-[#DDDDDD] rounded-xl">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleReplySubmit(comment._id.toString());
                            }
                          }}
                          placeholder="Write a reply..."
                          className="w-full px-3 py-2 text-gray-800 placeholder-gray-500 focus:outline-none resize-none rounded-xl"
                          style={{ minHeight: "40px", maxHeight: "100px" }}
                        />
                        <button
                          onClick={() =>
                            handleReplySubmit(comment._id.toString())
                          }
                          className="absolute right-2 top-2 text-blue-600 hover:text-blue-700"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              {menuOpen === comment._id && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 top-0 mt-8 w-32 bg-white border border-gray-200 rounded shadow-lg z-10"
                >
                  {comment.userId?._id === currentUserId ? (
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
            {/* Render Replies */}
            {getReplies(comment._id.toString()).length > 0 && (
              <div className="ml-12 mt-2 relative">
                {/* Connection line for replies - Facebook style curved line */}

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
                                  setMenuOpen(
                                    menuOpen === reply._id ? null : reply._id
                                  )
                                }
                                className="text-gray-500 hover:text-gray-700 ml-2"
                              >
                                <FaEllipsisV />
                              </button>
                            </div>
                            <p className="text-gray-700 break-all max-w-full mt-1">
                              {reply?.comment}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 ml-1 text-gray-500 text-xs">
                            <button className="hover:text-blue-600 transition-colors flex items-center space-x-1">
                              <FaHeart className="w-4 h-4" />
                              <span>Like</span>
                            </button>
                            <button
                              onClick={() =>
                                setReplyInputOpen(
                                  replyInputOpen === reply._id
                                    ? null
                                    : reply._id
                                )
                              }
                              className="hover:text-blue-600 transition-colors"
                            >
                              Reply
                            </button>
                            <span>
                              {getRelativeTime(new Date(reply.createdAt))}
                            </span>
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
                                      ? "/default-avatar.png"
                                      : "/default-avatar.png"
                                  } // Replace with current user's profile image
                                  alt="Your Profile"
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                                />
                                <div className="flex-1 relative border border-[#DDDDDD] rounded-xl">
                                  <textarea
                                    value={replyText}
                                    onChange={(e) =>
                                      setReplyText(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleReplySubmit(reply._id.toString());
                                      }
                                    }}
                                    placeholder="Write a reply..."
                                    className="w-full px-3 py-2 text-gray-800 placeholder-gray-500 focus:outline-none resize-none rounded-xl"
                                    style={{
                                      minHeight: "40px",
                                      maxHeight: "100px",
                                    }}
                                  />
                                  <button
                                    onClick={() =>
                                      handleReplySubmit(reply._id.toString())
                                    }
                                    className="absolute right-2 top-2 text-blue-600 hover:text-blue-700"
                                  >
                                    Send
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                        {menuOpen === reply._id && (
                          <motion.div
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
          <button className="text-blue-600 text-sm font-medium hover:underline">
            View all {comments.length} comments
          </button>
        </div>
      )}
    </section>
  );
};

export default PostCommentSection;
