"use client";
import { useState, useRef, useEffect } from "react";
import {  Send, Smile } from "lucide-react";
import Image from "next/image";
import CustomEmojiPicker from "@/components/ui/CustomEmojiPicker";
import {
  useCreateCommentMutation,
  useUpdateCommentMutation,
} from "@/redux/features/post/postApi";
import { IComment, IPost } from "@/types/post.types";
import { TError } from "@/types/error";
import { getFullName } from "@/utils/nameUtils";
import toast from "react-hot-toast";
import useUser from "@/hooks/useUser";
import { openAuthModal } from "@/redux/features/auth/authModalSlice";
import { useAppDispatch } from "@/redux/hooks";

interface PostCommentInputProps {
  post: IPost;
  editCommentId?: string | null;
  editCommentText?: string;
  setEditCommentId?: (id: string | null) => void;
  setEditCommentText?: (text: string) => void;
  setAllPosts?: (posts: IPost[] | ((prev: IPost[]) => IPost[])) => void;
}

const PostCommentInput = ({
  post,
  editCommentId,
  editCommentText,
  setEditCommentId,
  setEditCommentText,
  setAllPosts,
}: PostCommentInputProps) => {
  const user = useUser();
  const [newComment, setNewComment] = useState(editCommentText);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [createComment] = useCreateCommentMutation();
  const [updateComment] = useUpdateCommentMutation();

  const dispatch = useAppDispatch();

  // Sync newComment with editCommentText when it changes
  useEffect(() => {
    setNewComment(editCommentText);
    if (editCommentText && textareaRef.current) {
      textareaRef.current.focus();
      const length = editCommentText.length;
      textareaRef.current.setSelectionRange(length, length);
    } else if (editCommentText && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editCommentText]);

  // Auto-resize textarea, focus, and set cursor to end
  useEffect(() => {
    if (newComment && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.focus();
      const length = newComment.length;
      textarea.setSelectionRange(length, length);
    }
  }, [newComment]);

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setNewComment(newComment + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = (newComment + emoji).length;
      textareaRef.current.setSelectionRange(length, length);
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleCommentSubmit = async () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }

    if (newComment?.trim() !== "") {
      try {
        if (editCommentId) {
          const tempCommentId = `temp-${Date.now()}`;
          //optimistic update
          if (setAllPosts) {
            setAllPosts((prevPosts: IPost[]) =>
              prevPosts.map((p: IPost) => {
                if (p._id === post._id) {
                  return {
                    ...p,
                    comments: [
                      ...p.comments,
                      {
                        _id: tempCommentId,
                        userId: {
                          _id: user._id,
                          fullName: getFullName(user),
                          username: user.username,
                          profileImage: user.profileImage,
                        },
                        postId: post._id,
                        comment: newComment,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        reactions: [],
                        replies: [],
                      } as IComment,
                    ],
                  };
                }
                return p;
              })
            );
          }
          // Update comment
          const editCommentPayload = {
            commentId: editCommentId,
            postId: post?._id,
            comment: newComment,
          };
          // Optimistic update will handle UI changes automatically
          await updateComment(editCommentPayload).unwrap();
          if (setEditCommentId) setEditCommentId(null);
          if (setEditCommentText) setEditCommentText("");
        } else {
          // Optimistic update will add comment to UI immediately
          const tempCommentId = `temp-${Date.now()}`;
          if (setAllPosts) {
            setAllPosts((prevPosts: IPost[]) =>
              prevPosts.map((p: IPost) => {
                if (p._id === post._id) {
                  return {
                    ...p,
                    comments: [
                      ...p.comments,
                      {
                        _id: tempCommentId,
                        userId: {
                          _id: user._id,
                          fullName: getFullName(user),
                          username: user.username,
                          profileImage: user.profileImage,
                        },
                        postId: post._id,
                        comment: newComment,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        reactions: [],
                        replies: [],
                      } as IComment,
                    ],
                  };
                }
                return p;
              })
            );
          }
          await createComment({
            comment: newComment,
            postId: post?._id,
          }).unwrap();
        }
        setNewComment("");
        setShowEmojiPicker(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        const err = error as TError;
        toast.error(err?.data?.message || "Something went wrong!");
        // Optimistic update will automatically revert on error
        if (setAllPosts) {
          setAllPosts((prevPosts: IPost[]) =>
            prevPosts.map((p: IPost) => (p._id === post._id ? post : p))
          );
        }
      }
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setNewComment("");
    if (setEditCommentId) setEditCommentId(null);
    if (setEditCommentText) setEditCommentText("");
    setShowEmojiPicker(false);
  };

  return (
    <section className="mt-3 flex flex-col space-y-2 pt-5">
      <div className="flex space-x-2">
        {user && (
          <Image
            src={user?.profileImage || "/default-avatar.png"}
            alt={user?.username || "User"}
            width={40}
            height={40}
            className="size-[40px] rounded-full object-cover border border-gray-300 flex-shrink-0"
          />
        )}
        <div
          className={`w-full relative flex ${
            newComment ? "flex-col items-end" : "flex-row justify-between"
          } bg-red-100 rounded-xl text-base`}
        >
          {newComment === "" ? (
            <input
              ref={inputRef}
              type="text"
              placeholder={
                editCommentId ? "Edit your comment..." : "Write a comment..."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3.5 bg-green-100 text-gray-800 placeholder-gray-500 focus:outline-none rounded-full"
            />
          ) : (
            <textarea
              ref={textareaRef}
              placeholder={
                editCommentId ? "Edit your comment..." : "Write a comment..."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none resize-none rounded-2xl"
              style={{ minHeight: "20px", height: "auto" }}
            />
          )}
          <div className="w-full gap-4 -mt-3 p-3">
            {newComment ? (
              <div className={`flex ${editCommentId ? "justify-between" : "justify-end"} items-center gap-4 `}>
                {editCommentId && (
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleCommentSubmit}
                    className="text-gray-500 hover:text-primary cursor-pointer"
                  >
                    <Send size={20} />
                  </button>
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    <Smile size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-end mt-3">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <Smile size={24} />
                </button>
              </div>
            )}
          </div>
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute right-0 bottom-14 z-50"
            >
              <CustomEmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PostCommentInput;
