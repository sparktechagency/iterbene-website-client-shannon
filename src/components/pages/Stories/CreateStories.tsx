"use client";
import React, { useState, useRef, useCallback } from "react";
import {
  Camera,
  Type,
  Settings,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateStoryMutation } from "@/redux/features/stories/storiesApi";
import toast from "react-hot-toast";
import { TError } from "@/types/error";
import { useRouter } from "next/navigation";

type ViewType = "selection" | "text" | "photo";
type TextStyleType = "Clean" | "Bold" | "Typewriter" | "Modern";
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
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);

  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [createStory, { isLoading }] = useCreateStoryMutation();

  const backgroundColors: string[] = [
    "#3B82F6", "#EC4899", "#F97316", "#EF4444", "#8B5CF6", "#000000",
    "#7C3AED", "#BE185D", "#EA580C", "#F8BBD9", "#FDE047", "#A78BFA",
    "#6B7280", "#10B981", "#F59E0B", "#F472B6",
  ];

  const textStyles: TextStyleType[] = ["Clean", "Bold", "Typewriter", "Modern"];
  const privacyOptions: PrivacyType[] = ["public", "followers", "custom"];

  // Handle click outside settings
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle mouse scroll for zoom
  React.useEffect(() => {
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
    setShowSettings(false);
  };

  // Handle text drag
  const handleDrag = () => {
    if (!textRef.current) return;

    let isDragging = false;
    let currentX: number;
    let currentY: number;
    let initialX: number;
    let initialY: number;

    const startDragging = (e: MouseEvent) => {
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
      isDragging = true;
    };

    const drag = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        setTextPosition({ x: currentX, y: currentY });
      }
    };

    const stopDragging = () => {
      isDragging = false;
    };

    currentX = textPosition.x;
    currentY = textPosition.y;

    textRef.current.addEventListener("mousedown", startDragging);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDragging);

    return () => {
      textRef.current?.removeEventListener("mousedown", startDragging);
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("mouseup", stopDragging);
    };
  };

  const getProcessedImage = useCallback(
    async (
      image: HTMLImageElement,
      scale: number,
      rotate: number,
      overlayText: string,
      fontFamily: string,
      textPos: { x: number; y: number }
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

      // Draw text overlay
      if (overlayText) {
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.font = `${40 * pixelRatio}px ${fontFamily}`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          overlayText,
          canvas.width / 2 + textPos.x * pixelRatio,
          canvas.height / 2 + textPos.y * pixelRatio
        );
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
          textPosition
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
        return "Arial Black";
      case "Typewriter":
        return "Courier New";
      case "Modern":
        return "Helvetica";
      default:
        return "Arial";
    }
  };

  const settingsVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: { opacity: 0, scale: 0.8, y: -10, transition: { duration: 0.2 } },
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
              <div className="relative ml-auto" ref={settingsRef}>
                <motion.button
                  onClick={() => setShowSettings(!showSettings)}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="cursor-pointer"
                >
                  <Settings size={20} />
                </motion.button>
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 overflow-hidden"
                      variants={settingsVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {privacyOptions.map((option) => (
                        <motion.button
                          key={option}
                          className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer ${
                            privacy === option ? "bg-gray-300" : ""
                          }`}
                          onClick={() => {
                            setPrivacy(option);
                            setShowSettings(false);
                          }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="mb-6">
              <select
                value={textStyle}
                onChange={(e) => setTextStyle(e.target.value as TextStyleType)}
                className="w-full bg-white border border-gray-300 p-3 cursor-pointer focus:outline-none rounded-lg"
              >
                {textStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
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
          <div className="w-80 rounded-r-2xl p-6 text-gray-800 border-l flex flex-col border-gray-200">
            <div className="flex items-center mb-8">
              <button onClick={resetToSelection} className="mr-4 cursor-pointer">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-xl font-bold">Your story</h2>
              <div className="relative ml-auto" ref={settingsRef}>
                <motion.button
                  onClick={() => setShowSettings(!showSettings)}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="cursor-pointer"
                >
                  <Settings size={20} />
                </motion.button>
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10 overflow-hidden"
                      variants={settingsVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {privacyOptions.map((option) => (
                        <motion.button
                          key={option}
                          className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer ${
                            privacy === option ? "bg-gray-300" : ""
                          }`}
                          onClick={() => {
                            setPrivacy(option);
                            setShowSettings(false);
                          }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
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
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Add Text</h3>
              <textarea
                value={imageText}
                onChange={(e) => setImageText(e.target.value)}
                placeholder="Add text to image"
                className="w-full bg-white border border-gray-300 p-3 rounded-lg resize-none"
                rows={3}
              />
              <select
                value={textStyle}
                onChange={(e) => setTextStyle(e.target.value as TextStyleType)}
                className="w-full bg-white border border-gray-300 p-3 cursor-pointer focus:outline-none rounded-lg mt-2"
              >
                {textStyles.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
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
              <div className="w-96 h-[550px] rounded-3xl overflow-hidden relative bg-gray-200">
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
                      <div
                        ref={textRef}
                        onMouseDown={handleDrag}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: `translate(-50%, -50%) translate(${textPosition.x}px, ${textPosition.y}px)`,
                          color: "white",
                          fontSize: "24px",
                          fontFamily: getFontFamily(textStyle),
                          textAlign: "center",
                          textShadow: "0 0 5px rgba(0,0,0,0.5)",
                          width: "80%",
                          cursor: "move",
                          userSelect: "none",
                        }}
                      >
                        {imageText}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default CreateStories;