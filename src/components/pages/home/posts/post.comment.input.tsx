"use client";
import { useState, useRef, useEffect } from "react";
import { Loader2, Send, Smile } from "lucide-react";
import Image from "next/image";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import {
  useCreateCommentMutation,
  useUpdateCommentMutation,
} from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
import { TError } from "@/types/error";
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
}

const PostCommentInput = ({
  post,
  editCommentId,
  editCommentText,
  setEditCommentId,
  setEditCommentText,
}: PostCommentInputProps) => {
  const user = useUser();
  const [newComment, setNewComment] = useState(editCommentText);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
  const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();

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
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setNewComment(newComment + emojiData.emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = (newComment + emojiData.emoji).length;
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
          const editCommentPayload = {
            commentId: editCommentId,
            postId: post?._id,
            comment: newComment,
          };
          // Update existing comment
          await updateComment(editCommentPayload).unwrap();
          toast.success("Comment updated successfully!");
          if (setEditCommentId) setEditCommentId(null); // Clear edit state
          if (setEditCommentText) setEditCommentText("");
        } else {
          // Create new comment
          await createComment({
            comment: newComment,
            postId: post?._id,
          }).unwrap();
        }
        setNewComment(""); // Clear the input field
        setShowEmojiPicker(false); // Close emoji picker on submit
        if (inputRef.current) {
          inputRef.current.focus(); // Focus input after submit
        }
      } catch (error) {
        const err = error as TError;
        toast.error(err?.data?.message || "Something went wrong!");
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
    <section className="mt-3 flex flex-col space-y-2 pt-5 ">
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
          } bg-gray-100 rounded-xl text-base`}
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
              className="w-full px-4 py-3.5 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none rounded-full"
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
              className="w-full px-4 py-2.5 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none resize-none rounded-2xl"
              style={{ minHeight: "40px", height: "auto" }}
            />
          )}
          <div className="flex items-end gap-4 -mt-3 pb-4 pr-4">
            {newComment ? (
              <>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <Smile size={24} />
                </button>
                {isCreating || isUpdating ? (
                  <div className="flex items-center justify-center ">
                    <Loader2 className="animate-spin text-primary" size={26} />
                  </div>
                ) : (
                  <button
                    onClick={handleCommentSubmit}
                    className="text-gray-500 hover:text-primary cursor-pointer"
                  >
                    <Send size={24} />
                  </button>
                )}
                {editCommentId && (
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <Smile size={24} />
              </button>
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
                style={{ scrollbarColor: "gray #ffffff", zIndex: 9999 }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PostCommentInput;
