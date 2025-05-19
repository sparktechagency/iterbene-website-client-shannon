"use client";
import { useState, useRef, useEffect } from "react";
import { Camera, Smile } from "lucide-react";
import Image from "next/image";
import { IoMdSend } from "react-icons/io";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

interface PostCommentInputProps {
  newComment: string;
  setNewComment: (value: string) => void;
  handleAddComment: () => void;
}

const PostCommentInput: React.FC<PostCommentInputProps> = ({
  newComment,
  setNewComment,
  handleAddComment,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  // Trigger file input click when camera icon is clicked
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

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

  // Clean up preview image URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <section className="mt-3 flex flex-col space-y-2 pt-5">
      <div className="flex items-center space-x-2">
        <Image
          src="https://randomuser.me/api/portraits/men/2.jpg"
          alt="Current User"
          width={48}
          height={48}
          className="size-[48px] ring ring-primary rounded-full"
        />
        <div className="w-full relative px-3 py-4 border flex justify-between items-center border-[#DDDDDD] rounded-xl text-sm focus:outline-none focus:ring focus:ring-primary">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment"
            className="w-full outline-none"
          />
          <div className="flex items-center gap-3 text-gray-500">
            <button onClick={handleCameraClick} className="cursor-pointer">
              <Camera />
            </button>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="cursor-pointer"
            >
              <Smile />
            </button>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute right-0 bottom-16 z-10"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                theme={Theme.LIGHT} // Set theme to light for white scrollbar
                style={{ scrollbarColor: "gray #ffffff" }} // Custom scrollbar color
              />
            </div>
          )}
        </div>
        <button
          onClick={handleAddComment}
          className="text-white size-10 rounded-full bg-primary px-3 py-1 text-sm cursor-pointer"
        >
          <IoMdSend size={20} />
        </button>
      </div>
      {/* Image Preview */}
      {previewImage && (
        <div className="relative size-24 mt-2">
          <Image
            src={previewImage}
            alt="Preview"
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

    </section>
  );
};

export default PostCommentInput;
