"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera,
  Type,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Plus,
  Minus
} from "lucide-react";
import { motion } from "framer-motion";
import { useCreateStoryMutation } from "@/redux/features/stories/storiesApi";
import toast from "react-hot-toast";
import { TError } from "@/types/error";
import { useRouter } from "next/navigation";
import SelectField from "@/components/custom/SelectField";

type ViewType = "selection" | "text" | "photo";
type TextStyleType = "Clean" | "Bold" | "Typewriter" | "Modern" | "Serif" | "Cursive" | "Fantasy" | "Monospace" | "Impact" | "Comic";
type PrivacyType = "public" | "followers" | "custom";

const CreateStories: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("selection");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>("");
  const [imageText, setImageText] = useState<string>("");
  const [textPosition, setTextPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedBackground, setSelectedBackground] = useState<string>("#3B82F6");
  const [textStyle, setTextStyle] = useState<TextStyleType>("Clean");
  const [privacy, setPrivacy] = useState<PrivacyType>("public");
  const [scale, setScale] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);
  
  // New states for enhanced text features
  const [textFontSize, setTextFontSize] = useState<number>(24);
  const [textBackgroundColor, setTextBackgroundColor] = useState<string>("transparent");
  const [textColor, setTextColor] = useState<string>("#FFFFFF");
  const [textConstraints, setTextConstraints] = useState<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  }>({ left: 0, right: 0, top: 0, bottom: 0 });

  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [createStory, { isLoading }] = useCreateStoryMutation();

  const backgroundColors: string[] = [
    "#3B82F6", "#EC4899", "#F97316", "#EF4444", "#8B5CF6", "#000000",
    "#7C3AED", "#BE185D", "#EA580C", "#F8BBD9", "#FDE047", "#A78BFA",
    "#6B7280", "#10B981", "#F59E0B", "#F472B6",
  ];

  const textColors: string[] = [
    "#FFFFFF", "#000000", "#3B82F6", "#EC4899", "#F97316", "#EF4444",
    "#8B5CF6", "#10B981", "#F59E0B", "#F472B6", "#7C3AED", "#BE185D",
  ];

  const textBackgroundColors: string[] = [
    "transparent", "#000000", "#FFFFFF", "#3B82F6", "#EC4899", "#F97316",
    "#EF4444", "#8B5CF6", "#10B981", "#F59E0B", "#F472B6", "#7C3AED",
  ];

  const textStyles: TextStyleType[] = ["Clean", "Bold", "Typewriter", "Modern", "Serif", "Cursive", "Fantasy", "Monospace", "Impact", "Comic"];

  // Handle click outside settings
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        // setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle mouse scroll for zoom
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      setScale((prev) => {
        const newScale = prev + (event.deltaY > 0 ? -0.1 : 0.1);
        return Math.max(0.5, Math.min(newScale, 3));
      });
    };

    const container = imgRef.current?.parentElement;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  // Calculate text constraints based on container size
  useEffect(() => {
    if (containerRef.current && imageText) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const textWidth = imageText.length * (textFontSize * 0.6); // Approximate text width
      const textHeight = textFontSize + 20; // Text height with padding
      
      setTextConstraints({
        left: -(containerRect.width / 2) + (textWidth / 2),
        right: (containerRect.width / 2) - (textWidth / 2),
        top: -(containerRect.height / 2) + (textHeight / 2),
        bottom: (containerRect.height / 2) - (textHeight / 2),
      });
    }
  }, [imageText, textFontSize, containerRef.current]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
          setCurrentView("photo");
          setScale(1);
          setRotate(0);
          setTextPosition({ x: 0, y: 0 });
          setTextFontSize(24);
          setTextBackgroundColor("transparent");
          setTextColor("#FFFFFF");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoStoryClick = (): void => {
    fileInputRef.current?.click();
  };

  const resetToSelection = (): void => {
    setCurrentView("selection");
    setSelectedImage(null);
    setPreviewUrl(null);
    setTextContent("");
    setImageText("");
    setTextPosition({ x: 0, y: 0 });
    setSelectedBackground("#3B82F6");
    setPrivacy("public");
    setScale(1);
    setRotate(0);
    setTextFontSize(24);
    setTextBackgroundColor("transparent");
    setTextColor("#FFFFFF");
    setTextConstraints({ left: 0, right: 0, top: 0, bottom: 0 });
  };


  const increaseFontSize = () => {
    setTextFontSize(prev => Math.min(prev + 2, 48));
  };

  const decreaseFontSize = () => {
    setTextFontSize(prev => Math.max(prev - 2, 12));
  };

  const getProcessedImage = useCallback(
    async (
      image: HTMLImageElement,
      scale: number,
      rotate: number,
      overlayText: string,
      fontFamily: string,
      textPos: { x: number; y: number },
      fontSize: number,
      textBgColor: string,
      textFgColor: string
    ): Promise<File> => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      const pixelRatio = window.devicePixelRatio;
      canvas.width = image.naturalWidth * pixelRatio;
      canvas.height = image.naturalHeight * pixelRatio;

      ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        canvas.width / 2,
        canvas.height / 2
      );
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);
      ctx.drawImage(image, 0, 0);

      // Draw text overlay with background and styling
      if (overlayText) {
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.font = `${fontSize * pixelRatio}px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        const textX = canvas.width / 2 + textPos.x * pixelRatio;
        const textY = canvas.height / 2 + textPos.y * pixelRatio;
        
        // Draw text background if not transparent
        if (textBgColor !== "transparent") {
          const textMetrics = ctx.measureText(overlayText);
          const textWidth = textMetrics.width;
          const textHeight = fontSize * pixelRatio;
          
          ctx.fillStyle = textBgColor;
          ctx.fillRect(
            textX - textWidth / 2 - 10,
            textY - textHeight / 2 - 5,
            textWidth + 20,
            textHeight + 10
          );
        }
        
        // Draw text
        ctx.fillStyle = textFgColor;
        ctx.fillText(overlayText, textX, textY);
      }

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }
            resolve(
              new File([blob], "processed-image.jpg", { type: "image/jpeg" })
            );
          },
          "image/jpeg",
          0.8
        );
      });
    },
    []
  );

  const handleShareStory = async (): Promise<void> => {
    const formData = new FormData();

    if (currentView === "photo" && selectedImage && imgRef.current) {
      try {
        const processedImage = await getProcessedImage(
          imgRef.current,
          scale,
          rotate,
          imageText,
          getFontFamily(textStyle),
          textPosition,
          textFontSize,
          textBackgroundColor,
          textColor
        );
        formData.append("storyFiles", processedImage);
        if (imageText) formData.append("textContent", imageText);
        formData.append("privacy", privacy);
      } catch (err) {
        console.error("Failed to process image:", err);
        toast.error("Failed to process image. Please try again.");
        return;
      }
    } else if (currentView === "text" && textContent) {
      formData.append("textContent", textContent);
      formData.append("backgroundColor", selectedBackground);
      formData.append("privacy", privacy);
      formData.append("textFontFamily", getFontFamily(textStyle));
    } else {
      toast.error("Please provide content for the story.");
      return;
    }

    try {
      await createStory(formData).unwrap();
      router.push("/");
      toast.success("Story created successfully!");
      resetToSelection();
    } catch (err) {
      const error = err as TError;
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  const handleZoomIn = (): void => setScale((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = (): void => setScale((prev) => Math.max(prev - 0.1, 0.5));
  const handleRotate = (): void => setRotate((prev) => (prev + 90) % 360);

  const getFontFamily = (style: TextStyleType): string => {
    switch (style) {
      case "Bold":
        return "Arial Black, sans-serif";
      case "Typewriter":
        return "Courier New, monospace";
      case "Modern":
        return "Helvetica, Arial, sans-serif";
      case "Serif":
        return "Georgia, Times New Roman, serif";
      case "Cursive":
        return "Brush Script MT, cursive";
      case "Fantasy":
        return "Papyrus, fantasy";
      case "Monospace":
        return "Monaco, Consolas, monospace";
      case "Impact":
        return "Impact, Arial Black, sans-serif";
      case "Comic":
        return "Comic Sans MS, cursive";
      default:
        return "Arial, sans-serif";
    }
  };

  // Selection View
  if (currentView === "selection") {
    return (
      <section className="w-full bg-white p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Create Your Story</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              onClick={handlePhotoStoryClick}
              className="relative h-80 rounded-3xl cursor-pointer"
              style={{ background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)" }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <Camera size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">Create a photo story</h3>
              </div>
            </motion.div>
            <motion.div
              onClick={() => setCurrentView("text")}
              className="relative h-80 rounded-3xl cursor-pointer"
              style={{ background: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)" }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <Type size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">Create a text story</h3>
              </div>
            </motion.div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </section>
    );
  }

  // Text Story Editor
  if (currentView === "text") {
    return (
      <section className="w-full bg-gray-50 text-white rounded-2xl">
        <div className="flex flex-row-reverse">
          <div className="w-80 rounded-r-2xl p-6 text-gray-800 border-l flex flex-col border-gray-200">
            <div className="flex items-center mb-8">
              <button onClick={resetToSelection} className="mr-4 cursor-pointer">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-xl font-bold">Your story</h2>
            </div>
            <div className="mb-6">
              <SelectField
                name="textStyle"
                placeholder="Select text style"
                value={textStyle}
                onChange={(e) => setTextStyle(e.target.value as TextStyleType)}
                items={textStyles.map((style) => ({ value: style, label: style }))}
              />
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Backgrounds</h3>
              <div className="grid grid-cols-8 gap-2">
                {backgroundColors.map((color, index) => (
                  <motion.button
                    key={index}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                      selectedBackground === color ? "border-white" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedBackground(color)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-auto">
              <button
                onClick={resetToSelection}
                className="px-6 py-2 text-gray-400 cursor-pointer border rounded-lg"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleShareStory}
                className="px-6 py-2 bg-primary rounded-lg text-white cursor-pointer"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? "Uploading..." : "Upload Story"}
              </motion.button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative">
              <div
                className="w-96 h-[560px] rounded-3xl flex flex-col items-center justify-center relative overflow-hidden"
                style={{ backgroundColor: selectedBackground }}
              >
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  maxLength={250}
                  placeholder="Type Here"
                  className="w-full h-full bg-transparent text-white text-center text-2xl font-bold placeholder-white placeholder-opacity-60 resize-none border-none outline-none p-8"
                  style={{
                    fontFamily: getFontFamily(textStyle),
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Photo Story Editor
  if (currentView === "photo") {
    return (
      <section className="w-full bg-gray-50 text-white rounded-2xl">
        <div className="flex flex-row-reverse">
          <div className="w-80 rounded-r-2xl p-6 text-gray-800 border-l flex flex-col border-gray-200 max-h-screen overflow-y-auto">
            <div className="flex items-center mb-6">
              <button onClick={resetToSelection} className="mr-4 cursor-pointer">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-xl font-bold">Your story</h2>
            </div>

            {/* Image Controls */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Adjust Image</h3>
              <div className="flex gap-2 mb-3">
                <motion.button
                  onClick={handleZoomIn}
                  className="p-2 bg-gray-300 rounded-lg cursor-pointer"
                  title="Zoom In"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ZoomIn size={16} />
                </motion.button>
                <motion.button
                  onClick={handleZoomOut}
                  className="p-2 bg-gray-300 rounded-lg cursor-pointer"
                  title="Zoom Out"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ZoomOut size={16} />
                </motion.button>
                <motion.button
                  onClick={handleRotate}
                  className="p-2 bg-gray-300 rounded-lg cursor-pointer"
                  title="Rotate"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RotateCw size={16} />
                </motion.button>
              </div>
              <label className="text-sm font-medium">Zoom: {scale.toFixed(1)}x</label>
            </div>

            {/* Text Input */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Add Text</h3>
              <textarea
                value={imageText}
                onChange={(e) => setImageText(e.target.value)}
                placeholder="Add text to image"
                className="w-full bg-white border outline-none border-gray-300 p-3 rounded-lg resize-none"
                rows={3}
              />
            </div>

            {/* Font Style */}
            <div className="mb-6">
              <SelectField
                name="textStyle"
                placeholder="Select text style"
                value={textStyle}
                onChange={(e) => setTextStyle(e.target.value as TextStyleType)}
                items={textStyles.map((style) => ({ value: style, label: style }))}
              />
            </div>

            {/* Font Size Controls */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Font Size</h3>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={decreaseFontSize}
                  className="p-2 bg-gray-300 rounded-lg cursor-pointer"
                  title="Decrease Font Size"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus size={16} />
                </motion.button>
                <span className="text-sm font-medium min-w-12 text-center">{textFontSize}px</span>
                <motion.button
                  onClick={increaseFontSize}
                  className="p-2 bg-gray-300 rounded-lg cursor-pointer"
                  title="Increase Font Size"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={16} />
                </motion.button>
              </div>
            </div>

            {/* Text Color */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Text Color</h3>
              <div className="grid grid-cols-6 gap-2">
                {textColors.map((color, index) => (
                  <motion.button
                    key={index}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                      textColor === color ? "border-gray-800" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setTextColor(color)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>

            {/* Text Background Color */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Text Background</h3>
              <div className="grid grid-cols-6 gap-2">
                {textBackgroundColors.map((color, index) => (
                  <motion.button
                    key={index}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                      textBackgroundColor === color ? "border-gray-800" : "border-transparent"
                    } ${color === "transparent" ? "bg-gradient-to-br from-red-500 to-transparent" : ""}`}
                    style={{ backgroundColor: color === "transparent" ? "transparent" : color }}
                    onClick={() => setTextBackgroundColor(color)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {color === "transparent" && (
                      <div className="w-full h-full rounded-full border border-gray-400" style={{
                        background: "linear-gradient(45deg, transparent 45%, #ff0000 45%, #ff0000 55%, transparent 55%)"
                      }} />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-auto">
              <button
                onClick={resetToSelection}
                className="px-6 py-2 text-gray-400 cursor-pointer border rounded-lg"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleShareStory}
                className="px-6 py-2 bg-primary rounded-lg text-white cursor-pointer"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? "Uploading..." : "Upload Story"}
              </motion.button>
            </div>
          </div>

          {/* Image Preview */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative">
              <div ref={containerRef} className="w-96 h-[550px] rounded-3xl overflow-hidden relative bg-gray-200">
                {previewUrl && (
                  <div style={{ position: "relative", width: "100%", height: "550px" }}>
                    <img
                      ref={imgRef}
                      src={previewUrl}
                      alt="Story preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        transform: `scale(${scale}) rotate(${rotate}deg)`,
                      }}
                    />
                    {imageText && (
                      <motion.div
                        ref={textRef}
                        drag
                        dragMomentum={false}
                        dragConstraints={textConstraints}
                        dragElastic={0.1}
                        onDrag={(event, info) => {
                          setTextPosition({ x: info.point.x, y: info.point.y });
                        }}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          x: textPosition.x,
                          y: textPosition.y,
                          color: textColor,
                          fontSize: `${textFontSize}px`,
                          fontFamily: getFontFamily(textStyle),
                          textAlign: "center",
                          textShadow: "0 0 5px rgba(0,0,0,0.5)",
                          backgroundColor: textBackgroundColor,
                          padding: textBackgroundColor !== "transparent" ? "8px 12px" : "0",
                          borderRadius: textBackgroundColor !== "transparent" ? "4px" : "0",
                          maxWidth: "80%",
                          cursor: "grab",
                          userSelect: "none",
                          wordWrap: "break-word",
                        }}
                        whileDrag={{ 
                          cursor: "grabbing",
                          scale: 1.05,
                          zIndex: 10
                        }}
                        initial={{ scale: 1 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        {imageText}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
              {imageText && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  Drag text to reposition
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default CreateStories;