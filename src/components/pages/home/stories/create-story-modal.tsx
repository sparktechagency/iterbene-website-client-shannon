"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";
import { SketchPicker } from "react-color";

interface Media {
  url: string;
  type: "image" | "video";
}

interface CreateStoryModalProps {
  onClose: () => void;
  onAddStory: (newStory: {
    id: number;
    media: Media[];
    authorName: string;
    authorImage: string;
    text?: string;
    textColor?: string;
    font?: string;
    backgroundColor?: string;
  }) => void;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  onClose,
  onAddStory,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [font, setFont] = useState("Inter");
  const [mediaScale, setMediaScale] = useState(1); // For resizing media

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    const newPreviews = acceptedFiles.map((file) => {
      const url = URL.createObjectURL(file);
      const type: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
      return { url, type };
    });
    setPreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "video/*": [".mp4", ".mov"],
    },
    multiple: true,
  });

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedMedia: Media[] = previews.map((preview) => ({
        url: preview.url,
        type: preview.type,
      }));

      const newStory = {
        id: Date.now(),
        media: uploadedMedia,
        authorName: "Current User",
        authorImage:
          "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg",
        text,
        textColor,
        font,
        backgroundColor,
      };

      onAddStory(newStory);
      onClose();
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleZoomIn = () => {
    setMediaScale((prev) => Math.min(prev + 0.1, 2)); // Max scale: 2
  };

  const handleZoomOut = () => {
    setMediaScale((prev) => Math.max(prev - 0.1, 0.5)); // Min scale: 0.5
  };

  return (
    <div
      className="fixed inset-0 bg-sky-50 bg-opacity-90 z-50 flex items-center justify-center"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-xl p-6 shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-50"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create a New Story
        </h2>

        {/* Dropzone for File Upload */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">Drop the files here ...</p>
          ) : (
            <p className="text-gray-500">
              Drag & drop images or videos here, or click to select files
            </p>
          )}
        </div>

        {/* Preview Uploaded Files */}
        <div>
          {previews.length > 0 && (
            <div
              className="mb-4"
            >
              <h3 className="text-lg font-medium mb-2 text-gray-700">
                Preview
              </h3>
              <div
                className="relative w-full h-64 rounded-lg overflow-hidden"
                style={{ backgroundColor }}
              >
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative w-full h-full"
                  >
                    {preview.type === "image" ? (
                      <Image
                        src={preview.url}
                        alt="Preview"
                        width={400}
                        height={256}
                        className="object-contain w-full h-full"
                        style={{ transform: `scale(${mediaScale})` }}
                      />
                    ) : (
                      <video
                        src={preview.url}
                        className="object-contain w-full h-full"
                        muted
                        playsInline
                        style={{ transform: `scale(${mediaScale})` }}
                      />
                    )}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {text && (
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
                    style={{ color: textColor, fontFamily: font }}
                  >
                    <p className="text-2xl font-bold">{text}</p>
                  </div>
                )}
              </div>

              {/* Resize Controls */}
              <div className="flex justify-center gap-3 mt-2">
                <button
                  onClick={handleZoomOut}
                  className="bg-gray-200 p-2 rounded-full"
                >
                  <Minus size={20} />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="bg-gray-200 p-2 rounded-full"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Text Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Add Text
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your text here..."
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Text Color Picker */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Text Color
          </label>
          <button
            onClick={() => setShowTextColorPicker((prev) => !prev)}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Pick Text Color
          </button>
          <div>
            {showTextColorPicker && (
              <div
                className="absolute z-10 mt-2"
              >
                <SketchPicker
                  color={textColor}
                  onChange={(color) => setTextColor(color.hex)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Font Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Select Font
          </label>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Poppins">Poppins</option>
            <option value="Lora">Lora</option>
          </select>
        </div>

        {/* Background Color Picker */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Background Color
          </label>
          <button
            onClick={() => setShowBgColorPicker((prev) => !prev)}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Pick Background Color
          </button>
          <div>
            {showBgColorPicker && (
              <div
                className="absolute z-10 mt-2"
              >
                <SketchPicker
                  color={backgroundColor}
                  onChange={(color) => setBackgroundColor(color.hex)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            uploading || files.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          }`}
        >
          {uploading ? "Uploading..." : "Create Story"}
        </button>
      </div>
    </div>
  );
};

export default CreateStoryModal;