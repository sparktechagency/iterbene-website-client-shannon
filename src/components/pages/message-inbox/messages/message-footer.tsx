"use client";
import { useSendMessageMutation } from "@/redux/features/inbox/inboxApi";
import {
  Camera,
  Paperclip,
  Send,
  X,
  FileText,
  Smile,
  Eye,
  Download,
  Play,
} from "lucide-react";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { TError } from "@/types/error";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import CustomEmojiPicker from "@/components/ui/CustomEmojiPicker";

interface SelectedFile {
  file: File;
  preview?: string;
  id: string;
  type: "image" | "file" | "pdf" | "video";
  duration?: number;
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

  // Check if there are ONLY non-media attachments
  const hasOnlyNonMediaAttachments = useMemo(
    () =>
      selectedFiles.length > 0 &&
      selectedFiles.every(
        (file) =>
          !file.file.type.startsWith("image/") &&
          !file.file.type.startsWith("video/")
      ),
    [selectedFiles]
  );
  
  // Check if user is typing (has message or files)
  const isTyping = message.trim().length > 0 || selectedFiles.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const maxHeight = window.innerWidth < 768 ? 100 : 120;
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = newHeight + "px";
    }
  }, [message]);

  // Auto focus textarea when switching to typing mode
  useEffect(() => {
    if (isTyping && textareaRef.current && !hasOnlyNonMediaAttachments) {
      // Small delay to ensure layout transition is complete
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isTyping, hasOnlyNonMediaAttachments]);

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

  // Handle emoji selection with auto focus
  const handleEmojiSelect = (emoji: string) => {
    setMessage(message + emoji);
    if (textareaRef.current) {
      // Focus and set cursor position after emoji
      const newMessage = message + emoji;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        newMessage.length,
        newMessage.length
      );
    }
  };

  // Handle image/video selection with auto focus
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      const newFile: SelectedFile = {
        file,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: "file",
      };

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          newFile.preview = event.target?.result as string;
          newFile.type = "image";
          setSelectedFiles((prev) => [...prev, newFile]);
          // Auto focus textarea after file is added
          setTimeout(() => {
            if (textareaRef.current && !hasOnlyNonMediaAttachments) {
              textareaRef.current.focus();
            }
          }, 200);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        const videoUrl = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.src = videoUrl;
        video.onloadedmetadata = () => {
          video.currentTime = 1;
        };
        video.onseeked = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx?.drawImage(video, 0, 0);
          newFile.preview = canvas.toDataURL();
          newFile.type = "video";
          newFile.duration = video.duration;
          setSelectedFiles((prev) => [...prev, newFile]);
          // Auto focus textarea after file is added
          setTimeout(() => {
            if (textareaRef.current && !hasOnlyNonMediaAttachments) {
              textareaRef.current.focus();
            }
          }, 200);
          URL.revokeObjectURL(videoUrl);
        };
      }

      setTimeout(() => {
        if (attachmentScrollRef.current) {
          attachmentScrollRef.current.scrollLeft =
            attachmentScrollRef.current.scrollWidth;
        }
      }, 100);
    });

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

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          newFile.preview = event.target?.result as string;
          newFile.type = "image";
          setSelectedFiles((prev) => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        newFile.type = "pdf";
        setSelectedFiles((prev) => [...prev, newFile]);
      } else if (file.type.startsWith("video/")) {
        const videoUrl = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.src = videoUrl;
        video.onloadedmetadata = () => {
          video.currentTime = 1;
        };
        video.onseeked = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx?.drawImage(video, 0, 0);
          newFile.preview = canvas.toDataURL();
          newFile.type = "video";
          newFile.duration = video.duration;
          setSelectedFiles((prev) => [...prev, newFile]);
          URL.revokeObjectURL(videoUrl);
        };
      } else {
        setSelectedFiles((prev) => [...prev, newFile]);
      }

      setTimeout(() => {
        if (attachmentScrollRef.current) {
          attachmentScrollRef.current.scrollLeft =
            attachmentScrollRef.current.scrollWidth;
        }
      }, 100);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove selected file
  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  // Handle camera button click
  const handleCameraClick = () => {
    imageInputRef.current?.click();
  };

  // Handle attachment button click
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

  // Format video duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;
    if (isLoading) return;

    const formData = new FormData();

    if (!hasOnlyNonMediaAttachments) {
      formData.append("message", message);
    } else {
      formData.append("message", "");
    }

    formData.append("receiverId", receiverId as string);

    selectedFiles.forEach((selectedFile) => {
      formData.append("files", selectedFile?.file);
    });

    try {
      await sendMessage(formData).unwrap();
      setMessage("");
      setSelectedFiles([]);
      setShowEmojiPicker(false);
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
      {/* Selected Files Preview - Instagram/Facebook Style */}
      {selectedFiles?.length > 0 && (
        <div className="mb-3">
          <div
            ref={attachmentScrollRef}
            className="flex gap-2 sm:gap-3 overflow-x-auto p-2 scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {selectedFiles?.map((selectedFile) => (
              <div key={selectedFile.id} className="relative flex-shrink-0">
                {selectedFile.type === "image" && selectedFile.preview ? (
                  // Image preview - Instagram style with rounded corners
                  <div className="relative group">
                    <div className="relative overflow-hidden rounded-xl bg-gray-100">
                      <Image
                        src={selectedFile.preview}
                        alt="Selected"
                        width={80}
                        height={80}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover transition-transform group-hover:scale-105"
                      />
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl"></div>
                    </div>
                    <button
                      onClick={() => removeFile(selectedFile.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : selectedFile.type === "video" && selectedFile.preview ? (
                  // Video preview - Instagram style
                  <div className="relative group">
                    <div className="relative overflow-hidden rounded-xl bg-gray-100">
                      <Image
                        src={selectedFile.preview}
                        alt="Video thumbnail"
                        width={90}
                        height={80}
                        className="w-20 h-16 sm:w-24 sm:h-20 object-cover transition-transform group-hover:scale-105"
                      />
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl group-hover:bg-black/30 transition-colors">
                        <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <Play
                            size={14}
                            className="text-gray-800 ml-0.5"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                      {/* Duration badge */}
                      {selectedFile.duration && (
                        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                          {formatDuration(selectedFile.duration)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFile(selectedFile.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : selectedFile.type === "pdf" ? (
                  // PDF preview - Modern card style
                  <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow w-60 sm:w-72">
                    <div className="p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-red-50 p-2.5 rounded-xl flex-shrink-0">
                          <FileText size={20} className="text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate mb-1">
                            {selectedFile.file.name}
                          </h4>
                          <p className="text-xs text-gray-500 mb-3">
                            PDF • {formatFileSize(selectedFile.file.size)}
                          </p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const fileUrl = URL.createObjectURL(
                                  selectedFile.file
                                );
                                window.open(fileUrl, "_blank");
                              }}
                              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50"
                            >
                              <Eye size={12} />
                              <span>Preview</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const url = URL.createObjectURL(
                                  selectedFile.file
                                );
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = selectedFile.file.name;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-700 transition-colors px-2 py-1 rounded-lg hover:bg-gray-50"
                            >
                              <Download size={12} />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(selectedFile.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  // Regular file preview - Modern card style
                  <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow w-40 sm:w-48">
                    <div className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-gray-50 p-2 rounded-lg flex-shrink-0">
                          <FileText size={16} className="text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">
                            {selectedFile.file.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {getFileExtension(selectedFile.file.name)} •{" "}
                            {formatFileSize(selectedFile.file.size)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(selectedFile.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg"
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

      {/* Message Input Area - Dynamic Layout */}
      <div className="relative">
        {/* Hidden file inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="application/pdf"
          multiple
          className="hidden"
        />
        <input
          type="file"
          ref={imageInputRef}
          onChange={handleImageSelect}
          accept="video/*,image/*"
          multiple
          className="hidden"
        />

        <div
          className={`px-2 py-1.5 md:px-4 border border-[#CAD1CF] transition-all duration-300 ${
            isTyping ? "rounded-2xl" : "rounded-full"
          }`}
        >
          {/* Typing Mode - Textarea on top, buttons below */}
          {isTyping ? (
            <div className="space-y-2">
              {/* Textarea */}
              <div className="w-full">
                <textarea
                  ref={textareaRef}
                  placeholder={
                    hasOnlyNonMediaAttachments
                      ? "Files ready to send"
                      : "Type a message..."
                  }
                  value={hasOnlyNonMediaAttachments ? "" : message}
                  onChange={
                    hasOnlyNonMediaAttachments ? () => {} : handleChange
                  }
                  onKeyPress={
                    hasOnlyNonMediaAttachments ? () => {} : handleKeyPress
                  }
                  rows={1}
                  className={`w-full p-2 py-2.5 focus:outline-none resize-none overflow-y-auto bg-transparent scrollbar-hide text-gray-800 placeholder-gray-500 ${
                    hasOnlyNonMediaAttachments ? "cursor-not-allowed" : ""
                  }`}
                  style={{
                    minHeight: "32px",
                    maxHeight: window.innerWidth < 768 ? "100px" : "120px",
                  }}
                  disabled={isLoading || hasOnlyNonMediaAttachments}
                  readOnly={hasOnlyNonMediaAttachments}
                />
              </div>

              {/* Buttons Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* Attachment button */}
                  <button
                    onClick={handleAttachmentClick}
                    className="w-8 h-8 sm:w-9 sm:h-9 flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF] transition-colors cursor-pointer"
                    disabled={isLoading}
                    title="Attach PDF"
                  >
                    <Paperclip size={18} />
                  </button>

                  {/* Camera button */}
                  <button
                    onClick={handleCameraClick}
                    className="w-8 h-8 sm:w-9 sm:h-9 flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF] transition-colors cursor-pointer"
                    disabled={isLoading}
                    title="Add image or video"
                  >
                    <Camera size={18} />
                  </button>

                  {/* Emoji button */}
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-8 h-8 sm:w-9 sm:h-9 flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF] transition-colors cursor-pointer"
                    disabled={isLoading || hasOnlyNonMediaAttachments}
                    title="Add emoji"
                  >
                    <Smile size={18} />
                  </button>
                </div>

                {/* Send button */}
                {isLoading ? (
                  <CgSpinner className="animate-spin w-9 h-9 sm:w-10 sm:h-10 text-primary" />
                ) : (
                  <button
                    onClick={handleSendMessage}
                    disabled={
                      isLoading ||
                      (!message.trim() && selectedFiles.length === 0) ||
                      (hasOnlyNonMediaAttachments && selectedFiles.length === 0)
                    }
                    className="w-9 h-9 sm:w-10 sm:h-10 cursor-pointer flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} className="sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Default Mode - Original single row layout */
            <div className="flex items-end space-x-2">
              {/* Attachment button */}
              <button
                onClick={handleAttachmentClick}
                className="w-8 h-8 sm:w-9 sm:h-9 flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF] transition-colors cursor-pointer mb-1"
                disabled={isLoading}
                title="Attach PDF"
              >
                <Paperclip size={18} />
              </button>

              {/* Camera button */}
              <button
                onClick={handleCameraClick}
                className="w-8 h-8 sm:w-9 sm:h-9 flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF] transition-colors cursor-pointer mb-1"
                disabled={isLoading}
                title="Add image or video"
              >
                <Camera size={18} />
              </button>

              {/* Emoji button */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-8 h-8 sm:w-9 sm:h-9 flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF] transition-colors cursor-pointer mb-1"
                disabled={isLoading || hasOnlyNonMediaAttachments}
                title="Add emoji"
              >
                <Smile size={18} />
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                placeholder="Message"
                value={hasOnlyNonMediaAttachments ? "" : message}
                onChange={hasOnlyNonMediaAttachments ? () => {} : handleChange}
                onKeyPress={
                  hasOnlyNonMediaAttachments ? () => {} : handleKeyPress
                }
                rows={1}
                className={`flex-1 min-w-0 p-2 py-2.5 focus:outline-none resize-none overflow-y-auto bg-transparent scrollbar-hide text-gray-800 placeholder-gray-500 ${
                  hasOnlyNonMediaAttachments ? "cursor-not-allowed" : ""
                }`}
                style={{
                  minHeight: "32px",
                  maxHeight: window.innerWidth < 768 ? "100px" : "120px",
                }}
                disabled={isLoading || hasOnlyNonMediaAttachments}
                readOnly={hasOnlyNonMediaAttachments}
              />

              {/* Send button */}
              {isLoading ? (
                <CgSpinner className="animate-spin w-9 h-9 sm:w-10 sm:h-10 text-primary mb-1" />
              ) : (
                <button
                  onClick={handleSendMessage}
                  disabled={
                    isLoading ||
                    (!message.trim() && selectedFiles.length === 0) ||
                    (hasOnlyNonMediaAttachments && selectedFiles.length === 0)
                  }
                  className="w-9 h-9 sm:w-10 sm:h-10 cursor-pointer flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-1"
                >
                  <Send size={18} className="sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
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