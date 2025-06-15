"use client";
import { useSendMessageMutation } from "@/redux/features/inbox/inboxApi";
import { Camera, Send, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { TError } from "@/types/error";
import toast from "react-hot-toast";

interface SelectedFile {
  file: File;
  preview: string;
  id: string;
}

const MessageFooter = () => {
  const { receiverId } = useParams();
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);

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

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newFile: SelectedFile = {
            file,
            preview: event.target?.result as string,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          };

          setSelectedFiles((prev) => [...prev, newFile]);

          // Auto scroll to end after adding image
          setTimeout(() => {
            if (imageScrollRef.current) {
              imageScrollRef.current.scrollLeft =
                imageScrollRef.current.scrollWidth;
            }
          }, 100);
        };
        reader.readAsDataURL(file);
      }
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

  // Handle camera button click
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;
    if (isLoading) return;

    const formData = new FormData();
    formData.append("message", message);
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
    <div className="w-full p-5">
      {/* Selected Images Preview */}
      {selectedFiles?.length > 0 && (
        <div className="mb-3">
          <div
            ref={imageScrollRef}
            className="flex space-x-2 overflow-x-auto p-2 scrollbar-thin bg-white scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            style={{ scrollbarWidth: "thin" }}
          >
            {selectedFiles?.map((selectedFile) => (
              <div key={selectedFile.id} className="relative flex-shrink-0">
                <Image
                  src={selectedFile.preview}
                  alt="Selected"
                  width={60}
                  height={60}
                  className="size-[60px] rounded object-cover"
                />
                <button
                  onClick={() => removeFile(selectedFile.id)}
                  className="absolute -top-2  cursor-pointer -right-1 size-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Area */}
      <div className={`px-4 py-2 border border-[#CAD1CF] flex items-end space-x-2 ${message?.length > 0 ? "rounded-2xl" : "rounded-full"}`}>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          multiple
          className="hidden"
        />

        {/* Camera button */}
        <button
          onClick={handleCameraClick}
          className="size-10 flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF] transition-colors cursor-pointer"
          disabled={isLoading}
        >
          <Camera size={22} />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          placeholder="Type a message..."
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          rows={1}
          className="w-full p-2 focus:outline-none text-gray-800 placeholder-gray-500 resize-none overflow-hidden"
          style={{
            minHeight: "30px",
            maxHeight: "120px",
          }}
          disabled={isLoading}
        />

        {/* Send button */}
        <button
          onClick={handleSendMessage}
          disabled={
            isLoading || (!message.trim() && selectedFiles.length === 0)
          }
          className="size-10 cursor-pointer flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
};

export default MessageFooter;
