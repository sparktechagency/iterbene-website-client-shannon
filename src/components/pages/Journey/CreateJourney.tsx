"use client";
import SelectField from "@/components/custom/SelectField";
import { useCreateStoryMutation } from "@/redux/features/stories/storiesApi";
import { TError } from "@/types/error";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  RotateCw,
  Type,
  ZoomIn,
  ZoomOut,
  AlignCenter,
  AlignLeft,
  AlignRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

type ViewType = "selection" | "text" | "photo";
type TextStyleType = "Clean" | "Bold" | "Typewriter" | "Modern";
type PrivacyType = "public" | "followers" | "custom";
type TextAlignType = "left" | "center" | "right";

const CreateJourney: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("selection");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>("");
  const [imageText, setImageText] = useState<string>("");
  const [textPosition, setTextPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [selectedBackground, setSelectedBackground] =
    useState<string>("#3B82F6");
  const [textStyle, setTextStyle] = useState<TextStyleType>("Clean");
  const [textColor, setTextColor] = useState<string>("#FFFFFF");
  const [textSize, setTextSize] = useState<number>(24);
  const [textAlign, setTextAlign] = useState<TextAlignType>("center");
  const [privacy, setPrivacy] = useState<PrivacyType>("public");
  const [scale, setScale] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [createJourney, { isLoading }] = useCreateStoryMutation();

  const backgroundColors: string[] = [
    "#3B82F6",
    "#EC4899",
    "#F97316",
    "#EF4444",
    "#8B5CF6",
    "#000000",
    "#7C3AED",
    "#BE185D",
    "#EA580C",
    "#F8BBD9",
    "#FDE047",
    "#A78BFA",
    "#6B7280",
    "#10B981",
    "#F59E0B",
    "#F472B6",
  ];

  const textColors: string[] = [
    "#FFFFFF",
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
    "#FFC0CB",
  ];

  const textStyles: TextStyleType[] = ["Clean", "Bold", "Typewriter", "Modern"];
  const textSizes = [16, 20, 24, 28, 32, 36, 40];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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

  const handlePhotoJourneyClick = (): void => {
    fileInputRef.current?.click();
  };

  const resetToSelection = (): void => {
    setCurrentView("selection");
    setPreviewUrl(null);
    setTextContent("");
    setImageText("");
    setTextPosition({ x: 0, y: 0 });
    setSelectedBackground("#3B82F6");
    setTextColor("#FFFFFF");
    setTextSize(24);
    setTextAlign("center");
    setPrivacy("public");
    setScale(1);
    setRotate(0);
  };

  const handleZoomIn = (): void => setScale((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = (): void =>
    setScale((prev) => Math.max(prev - 0.1, 0.5));
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

  // Create canvas image for text-only stories
  const createTextImage = useCallback(
    (
      text: string,
      bgColor: string,
      fontFamily: string,
      fontSize: number,
      textColor: string,
      alignment: TextAlignType
    ): Promise<File> => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        // Set canvas dimensions (story size)
        canvas.width = 1080;
        canvas.height = 1920;

        // Fill background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set text properties
        ctx.fillStyle = textColor;
        ctx.font = `${fontSize * 2}px ${fontFamily}`; // Scale up for better quality
        ctx.textBaseline = "middle";

        // Set text alignment
        switch (alignment) {
          case "left":
            ctx.textAlign = "left";
            break;
          case "right":
            ctx.textAlign = "right";
            break;
          default:
            ctx.textAlign = "center";
        }

        // Calculate text position
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        let textX = centerX;

        if (alignment === "left") textX = canvas.width * 0.1;
        if (alignment === "right") textX = canvas.width * 0.9;

        // Word wrap for long text
        const maxWidth = canvas.width * 0.8;
        const words = text.split(" ");
        const lines: string[] = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = ctx.measureText(currentLine + " " + word).width;
          if (width < maxWidth) {
            currentLine += " " + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);

        // Draw text lines
        const lineHeight = fontSize * 2.5;
        const totalHeight = lines.length * lineHeight;
        const startY = centerY - totalHeight / 2;

        lines.forEach((line, index) => {
          ctx.fillText(line, textX, startY + index * lineHeight);
        });

        // Convert to blob and create file
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }
            resolve(new File([blob], "text-story.jpg", { type: "image/jpeg" }));
          },
          "image/jpeg",
          0.9
        );
      });
    },
    []
  );

  // Create canvas image for photo stories with text overlay
  const createPhotoWithTextImage = useCallback(
    async (
      image: HTMLImageElement,
      scale: number,
      rotate: number,
      overlayText: string,
      fontFamily: string,
      fontSize: number,
      textColor: string,
      textPos: { x: number; y: number }
    ): Promise<File> => {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        // Set canvas dimensions (story size)
        canvas.width = 1080;
        canvas.height = 1920;

        // Fill with white background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate image dimensions to fit story format
        const aspectRatio = image.naturalWidth / image.naturalHeight;
        let drawWidth, drawHeight;

        if (aspectRatio > canvas.width / canvas.height) {
          // Image is wider
          drawHeight = canvas.height;
          drawWidth = drawHeight * aspectRatio;
        } else {
          // Image is taller
          drawWidth = canvas.width;
          drawHeight = drawWidth / aspectRatio;
        }

        // Center the image
        const offsetX = (canvas.width - drawWidth) / 2;
        const offsetY = (canvas.height - drawHeight) / 2;

        // Save context for transformations
        ctx.save();

        // Apply transformations
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        // Draw image
        ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

        // Restore context
        ctx.restore();

        // Draw text overlay if exists
        if (overlayText) {
          ctx.fillStyle = textColor;
          ctx.font = `${fontSize * 3}px ${fontFamily}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Add text shadow for better visibility
          ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;

          // Calculate text position
          const textX = canvas.width / 2 + textPos.x * 5;
          const textY = canvas.height / 2 + textPos.y * 5;

          // Word wrap for overlay text
          const maxWidth = canvas.width * 0.8;
          const words = overlayText.split(" ");
          const lines: string[] = [];
          let currentLine = words[0];

          for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
              currentLine += " " + word;
            } else {
              lines.push(currentLine);
              currentLine = word;
            }
          }
          lines.push(currentLine);

          // Draw text lines
          const lineHeight = fontSize * 3.5;
          const totalHeight = lines.length * lineHeight;
          const startY = textY - totalHeight / 2;

          lines.forEach((line, index) => {
            ctx.fillText(line, textX, startY + index * lineHeight);
          });
        }

        // Convert to blob and create file
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }
            resolve(
              new File([blob], "photo-story.jpg", { type: "image/jpeg" })
            );
          },
          "image/jpeg",
          0.9
        );
      });
    },
    []
  );

  // Handle text drag start
  const handleTextMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!imageText) return;
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(true);
    const rect = event.currentTarget
      .closest(".story-container")
      ?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: event.clientX - rect.left - rect.width / 2 - textPosition.x,
        y: event.clientY - rect.top - rect.height / 2 - textPosition.y,
      });
    }
  };

  // Handle text drag move
  const handleTextMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const newX = event.clientX - rect.left - rect.width / 2 - dragStart.x;
    const newY = event.clientY - rect.top - rect.height / 2 - dragStart.y;

    // Constrain text within story bounds
    const maxX = rect.width / 2 - 50;
    const maxY = rect.height / 2 - 50;

    setTextPosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY)),
    });
  };

  // Handle text drag end
  const handleTextMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile drag
  const handleTextTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!imageText) return;
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(true);
    const touch = event.touches[0];
    const rect = event.currentTarget
      .closest(".story-container")
      ?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: touch.clientX - rect.left - rect.width / 2 - textPosition.x,
        y: touch.clientY - rect.top - rect.height / 2 - textPosition.y,
      });
    }
  };

  const handleTextTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const touch = event.touches[0];
    const rect = event.currentTarget.getBoundingClientRect();
    const newX = touch.clientX - rect.left - rect.width / 2 - dragStart.x;
    const newY = touch.clientY - rect.top - rect.height / 2 - dragStart.y;

    // Constrain text within story bounds
    const maxX = rect.width / 2 - 50;
    const maxY = rect.height / 2 - 50;

    setTextPosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY)),
    });
  };

  const handleTextTouchEnd = () => {
    setIsDragging(false);
  };

  const handleShareJourney = async (): Promise<void> => {
    const formData = new FormData();

    if (currentView === "photo" && previewUrl && imgRef.current) {
      try {
        const processedImage = await createPhotoWithTextImage(
          imgRef.current,
          scale,
          rotate,
          imageText,
          getFontFamily(textStyle),
          textSize,
          textColor,
          textPosition
        );

        formData.append("storyFiles", processedImage);
        if (imageText) formData.append("textContent", imageText);
        formData.append("textPosition", JSON.stringify(textPosition));
        formData.append("textColor", textColor);
        formData.append("textSize", textSize.toString());
        formData.append("textFontFamily", getFontFamily(textStyle));
        formData.append("privacy", privacy);
      } catch (err) {
        console.error("Failed to process image:", err);
        toast.error("Failed to process image. Please try again.");
        return;
      }
    } else if (currentView === "text" && textContent) {
      try {
        const textImage = await createTextImage(
          textContent,
          selectedBackground,
          getFontFamily(textStyle),
          textSize,
          textColor,
          textAlign
        );

        formData.append("storyFiles", textImage);
        formData.append("textContent", textContent);
        formData.append("backgroundColor", selectedBackground);
        formData.append("textColor", textColor);
        formData.append("textSize", textSize.toString());
        formData.append("textFontFamily", getFontFamily(textStyle));
        formData.append("privacy", privacy);
      } catch (err) {
        console.error("Failed to create text image:", err);
        toast.error("Failed to create text story. Please try again.");
        return;
      }
    } else {
      toast.error("Please provide content for the journey.");
      return;
    }

    try {
      await createJourney(formData).unwrap();
      router.push("/");
      toast.success("Journey created successfully!");
      resetToSelection();
    } catch (err) {
      const error = err as TError;
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  // Selection View
  if (currentView === "selection") {
    return (
      <section className="w-full bg-white p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Create Your Journey
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              onClick={handlePhotoJourneyClick}
              className="relative h-80 rounded-3xl cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <Camera size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Create a photo Journey
                </h3>
              </div>
            </motion.div>
            <motion.div
              onClick={() => setCurrentView("text")}
              className="relative h-80 rounded-3xl cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)",
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <Type size={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Create a text journey
                </h3>
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
        <div className="flex flex-col-reverse md:flex-row-reverse">
          <div className="w-80 rounded-r-2xl p-6 text-gray-800 border-l flex flex-col border-gray-200 max-h-screen overflow-y-auto">
            <div className="flex items-center mb-6">
              <button
                onClick={resetToSelection}
                className="mr-4 cursor-pointer"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-xl font-bold">Text Journey</h2>
            </div>

            {/* Text Style Selection */}
            <div className="mb-4">
              <SelectField
                name="textStyle"
                placeholder="Select text style"
                value={textStyle}
                onChange={(e) => setTextStyle(e.target.value as TextStyleType)}
                items={textStyles.map((style) => ({
                  value: style,
                  label: style,
                }))}
              />
            </div>

            {/* Text Size */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">
                Text Size
              </label>
              <select
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {textSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
            </div>

            {/* Text Alignment */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">
                Text Alignment
              </label>
              <div className="flex gap-2">
                {[
                  { value: "left", icon: AlignLeft },
                  { value: "center", icon: AlignCenter },
                  { value: "right", icon: AlignRight },
                ].map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTextAlign(value as TextAlignType)}
                    className={`p-2 rounded-lg border ${
                      textAlign === value
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300"
                    }`}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>

            {/* Text Colors */}
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-3">Text Color</h3>
              <div className="grid grid-cols-6 gap-2">
                {textColors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 ${
                      textColor === color
                        ? "border-gray-800"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setTextColor(color)}
                  />
                ))}
              </div>
            </div>

            {/* Background Colors */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Background Color</h3>
              <div className="grid grid-cols-4 gap-2">
                {backgroundColors.map((color, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedBackground === color
                        ? "border-gray-800"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedBackground(color)}
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
              <button
                onClick={handleShareJourney}
                className="px-6 py-2 bg-primary rounded-lg text-white cursor-pointer disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Journey"}
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative">
              {/* Story frame with phone-like appearance */}
              <div className="relative">
                <div
                  className="w-72 h-[480px] rounded-3xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
                  style={{ backgroundColor: selectedBackground }}
                >
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    maxLength={250}
                    placeholder="Type your journey here..."
                    className="w-full h-full bg-transparent resize-none border-none outline-none p-6 placeholder-opacity-60"
                    style={{
                      color: textColor,
                      fontFamily: getFontFamily(textStyle),
                      fontSize: `${textSize}px`,
                      textAlign: textAlign,
                    }}
                  />
                  <div className="absolute bottom-4 right-4 text-xs opacity-50">
                    {textContent.length}/250
                  </div>
                </div>

                {/* Story preview label */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
                  Journey Preview
                </div>
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
        <div className="flex flex-col-reverse md:flex-row-reverse">
          <div className="w-80 rounded-r-2xl p-6 text-gray-800 border-l flex flex-col border-gray-200 max-h-screen overflow-y-auto">
            <div className="flex items-center mb-6">
              <button
                onClick={resetToSelection}
                className="mr-4 cursor-pointer"
              >
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-xl font-bold">Photo Journey</h2>
            </div>

            {/* Image Controls */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Adjust Image</h3>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-gray-200 rounded-lg cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-gray-200 rounded-lg cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 bg-gray-200 rounded-lg cursor-pointer"
                  title="Rotate"
                >
                  <RotateCw size={16} />
                </button>
              </div>
            </div>

            {/* Text Overlay */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Text Overlay</h3>
              <textarea
                value={imageText}
                onChange={(e) => setImageText(e.target.value)}
                placeholder="Add text overlay..."
                className="w-full bg-white border border-gray-300 p-3 rounded-lg resize-none mb-3"
                rows={3}
                maxLength={100}
              />

              {imageText && (
                <>
                  {/* Text Style */}
                  <div className="mb-3">
                    <SelectField
                      name="textStyle"
                      placeholder="Select text style"
                      value={textStyle}
                      onChange={(e) =>
                        setTextStyle(e.target.value as TextStyleType)
                      }
                      items={textStyles.map((style) => ({
                        value: style,
                        label: style,
                      }))}
                    />
                  </div>

                  {/* Text Size */}
                  <div className="mb-3">
                    <label className="text-sm font-medium mb-2 block">
                      Text Size
                    </label>
                    <select
                      value={textSize}
                      onChange={(e) => setTextSize(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      {textSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}px
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Text Color */}
                  <div className="mb-3">
                    <h4 className="text-sm font-medium mb-2">Text Color</h4>
                    <div className="grid grid-cols-6 gap-2">
                      {textColors.map((color, index) => (
                        <button
                          key={index}
                          className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                            textColor === color
                              ? "border-gray-500"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setTextColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between mt-auto">
              <button
                onClick={resetToSelection}
                className="px-6 py-2 text-gray-400 cursor-pointer border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleShareJourney}
                className="px-6 py-2 bg-primary rounded-lg text-white cursor-pointer disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Journey"}
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative">
              {/* Story frame with phone-like appearance */}
              <div className="relative">
                <div
                  className="story-container w-72 h-[480px] rounded-3xl overflow-hidden relative bg-gray-200 "
                  onMouseMove={handleTextMouseMove}
                  onMouseUp={handleTextMouseUp}
                >
                  {previewUrl && (
                    <>
                      <Image
                        ref={imgRef}
                        src={previewUrl}
                        alt="Journey preview"
                        fill
                        className="object-cover"
                        style={{
                          transform: `scale(${scale}) rotate(${rotate}deg)`,
                        }}
                      />
                      {imageText && (
                        <div
                          className={`w-full absolute select-none  ${
                            isDragging ? "cursor-grabbing" : "cursor-grab"
                          }`}
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%) translate(${textPosition.x}px, ${textPosition.y}px)`,
                            color: textColor,
                            fontSize: `${textSize}px`,
                            fontFamily: getFontFamily(textStyle),
                            textAlign: "center",
                            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                            wordWrap: "break-word",
                            lineHeight: "1.2",
                            maxWidth: "90%",
                            padding: "8px",
                            userSelect: "none",
                            zIndex: 10,
                          }}
                          onMouseDown={handleTextMouseDown}
                          onTouchStart={handleTextTouchStart}
                          onTouchMove={handleTextTouchMove}
                          onTouchEnd={handleTextTouchEnd}
                        >
                          {imageText}
                        </div>
                      )}
                      {isDragging && (
                        <div className="absolute inset-0 bg-transparent bg-opacity-20 pointer-events-none flex items-center justify-center"></div>
                      )}
                    </>
                  )}
                </div>

                {/* Story preview label */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
                  Story Preview
                </div>
              </div>

              {/* Canvas for processing (hidden) */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default CreateJourney;
