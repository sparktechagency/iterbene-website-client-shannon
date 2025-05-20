"use client";
import { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react";
import Image from "next/image";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useCreateCommentMutation } from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
import { TError } from "@/types/error";
import toast from "react-hot-toast";
import useUser from "@/hooks/useUser";

const PostCommentInput = ({ post }: { post: IPost }) => {
  const user = useUser();
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [createComment] = useCreateCommentMutation();

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [newComment]);

  // Handle emoji selection
  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setNewComment(newComment + emojiData.emoji);
    // Do not close the picker here
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
    if (newComment.trim() !== "") {
      try {
        await createComment({
          comment: newComment,
          postId: post?._id,
        }).unwrap();
        setNewComment(""); // Clear the input field
      } catch (error) {
        const err = error as TError;
        toast.error(err?.data?.message || "Something went wrong!");
      }
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent adding a new line
      handleCommentSubmit();
    }
  };

  return (
    <section className="mt-3 flex flex-col space-y-2 pt-5">
      <div className="flex space-x-2">
        <Image
          src={user?.profileImage}
          alt={user?.username}
          width={48}
          height={48}
          className="size-[48px] ring ring-primary rounded-full"
        />
        <div className="w-full relative border flex justify-between items-center border-[#DDDDDD] rounded-xl text-base focus:outline-none focus:ring focus:ring-primary resize-none">
          <textarea
            ref={textareaRef}
            placeholder="Write your comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown} // Add this to handle Enter key
            className="w-full px-3 pt-3 focus:outline-none text-gray-800 placeholder-gray-500 resize-none"
          />
          <div className="flex items-center gap-3 text-gray-500 pr-3">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="cursor-pointer"
            >
              <Smile />
            </button>
          </div>
          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute right-0 bottom-16 z-10"
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
    </section>
  );
};

export default PostCommentInput;
