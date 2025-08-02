"use client";
import { useSendMessageMutation } from "@/redux/features/inbox/inboxApi";
import { Camera, Paperclip, Send, X, FileText, Smile } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { TError } from "@/types/error";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import CustomEmojiPicker from "@/components/ui/CustomEmojiPicker";

interface SelectedFile {
  file: File;
  preview?: string; // Optional for non-image files
  id: string;
  type: "image" | "file";
}

const MessageFooter = () => {
  const { receiverId } = useParams();
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const attachmentScrollRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 120); // max 120px height
      textarea.style.height = newHeight + "px";
    }
  }, [message]);

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

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setMessage(message + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = (message + emoji).length;
      textareaRef.current.setSelectionRange(length, length);
    }
  };

  // Handle image selection (for camera button)
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newFile: SelectedFile = {
            file,
            preview: event.target?.result as string,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            type: "image",
          };

          setSelectedFiles((prev) => [...prev, newFile]);

          // Auto scroll to end after adding attachment
          setTimeout(() => {
            if (attachmentScrollRef.current) {
              attachmentScrollRef.current.scrollLeft =
                attachmentScrollRef.current.scrollWidth;
            }
          }, 100);
        };
        reader.readAsDataURL(file);
      }
    });

    // Clear input
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Handle file selection (for attachment button)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      const newFile: SelectedFile = {
        file,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: "file",
      };

      // If it's an image, add preview
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          newFile.preview = event.target?.result as string;
          newFile.type = "image";
          setSelectedFiles((prev) => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
      } else {
        setSelectedFiles((prev) => [...prev, newFile]);
      }

      // Auto scroll to end after adding attachment
      setTimeout(() => {
        if (attachmentScrollRef.current) {
          attachmentScrollRef.current.scrollLeft =
            attachmentScrollRef.current.scrollWidth;
        }
      }, 100);
    });

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove selected file
  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  // Handle camera button click (images only)
  const handleCameraClick = () => {
    imageInputRef.current?.click();
  };

  // Handle attachment button click (all files)
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get file extension
  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toUpperCase() || "";
  };

  // Check if there are ONLY non-image attachments (no images at all)
  const hasOnlyNonImageAttachments =
    selectedFiles.length > 0 &&
    selectedFiles.every((file) => !file.file.type.startsWith("image/"));

  // Handle send message
  const handleSendMessage = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;
    if (isLoading) return;

    const formData = new FormData();

    // Send message text normally, unless there are only non-image attachments
    if (!hasOnlyNonImageAttachments) {
      formData.append("message", message);
    } else {
      // For only non-image attachments, send empty message
      formData.append("message", "");
    }

    formData.append("receiverId", receiverId as string);

    // Add files to form data
    selectedFiles.forEach((selectedFile) => {
      formData.append("files", selectedFile?.file);
    });

    try {
      await sendMessage(formData).unwrap();
      // Reset form
      setMessage("");
      setSelectedFiles([]);
      setShowEmojiPicker(false);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full p-3 md:p-5">
      {/* Selected Files Preview */}
      {selectedFiles?.length > 0 && (
        <div className="mb-3">
          <div
            ref={attachmentScrollRef}
            className="flex space-x-2 overflow-x-auto p-2 scrollbar-thin bg-white scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-hide"
            style={{ scrollbarWidth: "thin" }}
          >
            {selectedFiles?.map((selectedFile) => (
              <div key={selectedFile.id} className="relative flex-shrink-0">
                {selectedFile.type === "image" && selectedFile.preview ? (
                  // Image preview
                  <div className="relative">
                    <Image
                      src={selectedFile.preview}
                      alt="Selected"
                      width={60}
                      height={60}
                      className="size-[60px] rounded object-cover"
                    />
                    <button
                      onClick={() => removeFile(selectedFile.id)}
                      className="absolute -top-2 cursor-pointer -right-1 size-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  // File preview
                  <div className="relative bg-gray-100 rounded-lg p-2 w-32 border">
                    <div className="flex items-center space-x-2">
                      <FileText
                        size={16}
                        className="text-gray-600 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-800 truncate font-medium">
                          {selectedFile.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getFileExtension(selectedFile.file.name)} •{" "}
                          {formatFileSize(selectedFile.file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(selectedFile.id)}
                      className="absolute -top-2 cursor-pointer -right-1 size-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Area */}
      <div className="relative">
        <div
          className={`px-2 py-1.5 md:px-4 border border-[#CAD1CF] flex items-center space-x-2 ${message?.length > 0 ? "rounded-2xl" : "rounded-full"
            }`}>
        {/* Hidden file inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          //  only can accept pdf
          accept="application/pdf"
          multiple
          className="hidden"
        />
        <input
          type="file"
          ref={imageInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          multiple
          className="hidden"
        />

        {/* Attachment button (all files) */}
        <button
          onClick={handleAttachmentClick}
          className="size-8 flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF] transition-colors cursor-pointer"
          disabled={isLoading}
          title="Attach file"
        >
          <Paperclip size={20} />
        </button>

        {/* Camera button (images only) */}
        <button
          onClick={handleCameraClick}
          className="size-8 flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF] transition-colors cursor-pointer"
          disabled={isLoading}
          title="Add image"
        >
          <Camera size={20} />
        </button>

        {/* Emoji button */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="size-8 flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF] transition-colors cursor-pointer"
          disabled={isLoading || hasOnlyNonImageAttachments}
          title="Add emoji"
        >
          <Smile size={20} />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="input-message"
          // placeholder={hasOnlyNonImageAttachments ? "You can't send documents and texts at the same time" : "Type a message..."}
          placeholder="Type a message..."
          value={hasOnlyNonImageAttachments ? "" : message}
          onChange={hasOnlyNonImageAttachments ? () => { } : handleChange}
          onKeyPress={hasOnlyNonImageAttachments ? () => { } : handleKeyPress}
          rows={1}
          className={`w-full p-2 focus:outline-none resize-none overflow-y-auto bg-transparent scrollbar-hide ${hasOnlyNonImageAttachments
              ? "text-gray-800 placeholder-gray-500 cursor-not-allowed "
              : "text-gray-800 placeholder-gray-500"
            }`}
          style={{
            minHeight: "30px",
            maxHeight: "120px",
          }}
          disabled={isLoading || hasOnlyNonImageAttachments}
          readOnly={hasOnlyNonImageAttachments}
        />

        {/* Send button */}
        {isLoading ? (
          <CgSpinner className="animate-spin size-9 text-primary" />
        ) : (
          <button
            onClick={handleSendMessage}
            disabled={
              isLoading ||
              (!message.trim() && selectedFiles.length === 0) ||
              (hasOnlyNonImageAttachments && selectedFiles.length === 0)
            }
            className="size-9 cursor-pointer flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        )}
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-full mb-2 right-0 z-50"
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
  );
};

export default MessageFooter;
