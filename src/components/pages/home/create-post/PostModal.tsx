"use client";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { FilePreview } from "./create-post";
import Image from "next/image";
import CustomModal from "@/components/custom/custom-modal";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/custom/custom-button";

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenItinerary: () => void;
}

export default function PostModal({ visible, onClose }: PostModalProps) {
  const [postContent, setPostContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [visitedLocation, setVisitedLocation] = useState<Location | null>(null);
  const [visitedLocationName, setVisitedLocationName] = useState("");

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = () => {
    // Handle post creation
    setPostContent("");
    setSelectedFiles([]);
    setVisitedLocation(null);
    setVisitedLocationName("");
    onClose();
  };

  //   const renderPrivacyIcon = () => {
  //     switch (privacyOption) {
  //       case "PUBLIC":
  //         return <GlobalOutlined />;
  //       case "FRIENDS":
  //         return <UsergroupAddOutlined />;
  //       case "PRIVATE":
  //         return <LockOutlined />;
  //       default:
  //         return <GlobalOutlined />;
  //     }
  //   };

  return (
    <CustomModal
      header={
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800">Create Post</h2>
          <button
            className="text-gray-600  border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
            onClick={onClose}
          >
            <IoClose size={18} />
          </button>
        </div>
      }
      isOpen={visible}
      onClose={onClose}
      className="w-full p-2"
    >
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2">
          U
        </div>
        <div>
          <div className="font-semibold">User Name</div>
        </div>
      </div>
      {/* Text area */}
      <textarea
        placeholder="What's on your mind?"
        value={postContent}
        rows={7}
        style={{ resize: "none" }}
        onChange={(e) => setPostContent(e.target.value)}
        className="w-full p-2 outline-none rounded mb-4"
      />
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith("image/") ? (
                <Image
                  src={file.preview}
                  alt={`Preview ${index}`}
                  width={200}
                  height={200}
                  className="w-full h-32 object-cover rounded"
                />
              ) : file.type.startsWith("video/") ? (
                <video
                  src={file.preview}
                  controls
                  className="w-full h-32 object-cover rounded"
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded">
                  <span>{file.name}</span>
                </div>
              )}
              <button
                className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                onClick={() => removeFile(index)}
              >
                <span className="text-red-500">✕</span>
              </button>
            </div>
          ))}
        </div>
      )}
      {visitedLocationName && (
        <div className="mb-4 p-2 bg-gray-100 rounded flex items-center">
          <MapPin className="text-red-500 mr-1" />
          <span className="text-sm">{visitedLocationName}</span>
        </div>
      )}
      <CustomButton
        variant="default"
        className="px-5 py-3"
        onClick={handleCreatePost}
        fullWidth
      >
        Post
      </CustomButton>
    </CustomModal>
  );
}
