"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { X, Plus, Minus, Type, Sticker, Palette } from "lucide-react";
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
    textPosition?: { x: number; y: number };
    stickers?: string[];
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
  const [mediaScale, setMediaScale] = useState(1);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [stickers, setStickers] = useState<string[]>([]);
  const [showStickerPicker, setShowStickerPicker] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    const newPreviews = acceptedFiles.map((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("video/") ? "video" : "image";
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
        textPosition,
        stickers,
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
    setMediaScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setMediaScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setTextPosition({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left - rect.width / 2;
      const y = touch.clientY - rect.top - rect.height / 2;
      setTextPosition({ x, y });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleAddSticker = (sticker: string) => {
    setStickers((prev) => [...prev, sticker]);
    setShowStickerPicker(false);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-black/50">
        <button onClick={onClose} className="text-white">
          <X size={24} />
        </button>
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className={`px-4 py-2 rounded-full text-white font-semibold ${
            uploading || files.length === 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {uploading ? "Uploading..." : "Done"}
        </button>
      </div>

      {/* Preview Area */}
      {previews.length > 0 ? (
        <div
          className="flex-1 flex items-center justify-center relative"
          style={{ backgroundColor }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {previews.map((preview, index) => (
            <div key={index} className="relative w-full h-full">
              {preview.type === "image" ? (
                <Image
                  src={preview.url}
                  alt="Preview"
                  width={400}
                  height={600}
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
              className="absolute text-center"
              style={{
                color: textColor,
                fontFamily: font,
                transform: `translate(${textPosition.x}px, ${textPosition.y}px)`,
                cursor: isDragging ? "grabbing" : "grab",
              }}
            >
              <p className="text-2xl font-bold">{text}</p>
            </div>
          )}
          {stickers.map((sticker, index) => (
            <div
              key={index}
              className="absolute text-4xl"
              style={{
                top: `${50 + index * 40}px`,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {sticker}
            </div>
          ))}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex-1 flex items-center justify-center text-center ${
            isDragActive ? "bg-gray-800" : "bg-gray-900"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-white">Drop the files here ...</p>
          ) : (
            <p className="text-white">
              Drag & drop images or videos here, or tap to select files
            </p>
          )}
        </div>
      )}

      {/* Toolbar */}
      {previews.length > 0 && (
        <div className="bg-black/50 p-4 flex justify-around items-center">
          {/* Zoom Controls */}
          <div className="flex gap-2">
            <button
              onClick={handleZoomOut}
              className="bg-white/20 p-2 rounded-full text-white"
            >
              <Minus size={20} />
            </button>
            <button
              onClick={handleZoomIn}
              className="bg-white/20 p-2 rounded-full text-white"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Text Tool */}
          <div className="relative">
            <button
              onClick={() => setText(text ? "" : "Edit Text")}
              className="bg-white/20 p-2 rounded-full text-white"
            >
              <Type size={20} />
            </button>
            {text && (
              <div className="absolute bottom-16 left-0 bg-black/80 p-2 rounded-lg">
                <input
                  type="text"
                  value={text === "Edit Text" ? "" : text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type here..."
                  className="p-2 bg-transparent text-white border-b border-white focus:outline-none"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setShowTextColorPicker((prev) => !prev)}
                    className="bg-white/20 p-2 rounded-full text-white"
                  >
                    <Palette size={16} />
                  </button>
                  {showTextColorPicker && (
                    <div className="absolute bottom-12 left-0 z-10">
                      <SketchPicker
                        color={textColor}
                        onChange={(color) => setTextColor(color.hex)}
                      />
                    </div>
                  )}
                  <select
                    value={font}
                    onChange={(e) => setFont(e.target.value)}
                    className="p-1 bg-transparent text-white border-b border-white"
                  >
                    <option value="Inter" className="text-black">Inter</option>
                    <option value="Roboto" className="text-black">Roboto</option>
                    <option value="Poppins" className="text-black">Poppins</option>
                    <option value="Lora" className="text-black">Lora</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Sticker Tool */}
          <div className="relative">
            <button
              onClick={() => setShowStickerPicker((prev) => !prev)}
              className="bg-white/20 p-2 rounded-full text-white"
            >
              <Sticker size={20} />
            </button>
            {showStickerPicker && (
              <div className="absolute bottom-16 left-0 bg-black/80 p-2 rounded-lg flex gap-2">
                {["😊", "❤️", "🔥", "🎉", "🌟"].map((sticker) => (
                  <button
                    key={sticker}
                    onClick={() => handleAddSticker(sticker)}
                    className="text-2xl"
                  >
                    {sticker}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Background Color Tool */}
          <div className="relative">
            <button
              onClick={() => setShowBgColorPicker((prev) => !prev)}
              className="bg-white/20 p-2 rounded-full text-white"
            >
              <Palette size={20} />
            </button>
            {showBgColorPicker && (
              <div className="absolute bottom-16 left-0 z-10">
                <SketchPicker
                  color={backgroundColor}
                  onChange={(color) => setBackgroundColor(color.hex)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateStoryModal;