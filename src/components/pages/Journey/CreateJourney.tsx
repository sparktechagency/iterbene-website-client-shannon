"use client";
import SelectField from "@/components/custom/SelectField";
import { useCreateStoryMutation } from "@/redux/features/stories/storiesApi";
import { TError } from "@/types/error";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Camera,
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
  const [imagePosition, setImagePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isImageDragging, setIsImageDragging] = useState<boolean>(false);
  const [imageDragStart, setImageDragStart] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [selectedBackground, setSelectedBackground] =
    useState<string>("#3B82F6");
  const [textStyle, setTextStyle] = useState<TextStyleType>("Clean");
  const [textColor, setTextColor] = useState<string>("#000000");
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
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
  const textSizes = [
    {
      value: 16,
      label: "16px",
    },
    {
      value: 20,
      label: "20px",
    },
    {
      value: 22,
      label: "22px",
    },
    {
      value: 24,
      label: "24px",
    },
    {
      value: 32,
      label: "32px",
    },
    {
      value: 36,
      label: "36px",
    },
    {
      value: 40,
      label: "40px",
    },
    {
      value: 48,
      label: "48px",
    },
    {
      value: 56,
      label: "56px",
    },
    {
      value: 64,
      label: "64px",
    },
    {
      value: 72,
      label: "72px",
    },
  ];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
          setCurrentView("photo");
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
    setImagePosition({ x: 0, y: 0 });
    setSelectedBackground("#3B82F6");
    setTextColor("#000000");
    setTextSize(24);
    setTextAlign("center");
    setPrivacy("public");
    setScale(1);
    setRotate(0);
    setIsImageDragging(false);
  };

  const handleZoomIn = (): void => setScale((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = (): void =>
    setScale((prev) => Math.max(prev - 0.1, 0.5));

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

  // Add these new handler functions for image dragging
  const handleImageMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsImageDragging(true);
    setImageDragStart({
      x: event.clientX - imagePosition.x,
      y: event.clientY - imagePosition.y,
    });
  };

  const handleImageMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isImageDragging) return;

    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const newX = event.clientX - imageDragStart.x;
    const newY = event.clientY - imageDragStart.y;

    // Constrain image within reasonable bounds
    const maxX = rect.width / 2;
    const maxY = rect.height / 2;

    setImagePosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY)),
    });
  };

  const handleImageMouseUp = () => {
    setIsImageDragging(false);
  };

  // Touch handlers for mobile
  const handleImageTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const touch = event.touches[0];
    setIsImageDragging(true);
    setImageDragStart({
      x: touch.clientX - imagePosition.x,
      y: touch.clientY - imagePosition.y,
    });
  };

  const handleImageTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isImageDragging) return;

    const touch = event.touches[0];
    const rect = event.currentTarget.getBoundingClientRect();
    const newX = touch.clientX - imageDragStart.x;
    const newY = touch.clientY - imageDragStart.y;

    const maxX = rect.width / 2;
    const maxY = rect.height / 2;

    setImagePosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY)),
    });
  };

  const handleImageTouchEnd = () => {
    setIsImageDragging(false);
  };

  // Enhanced zoom functions with better control
  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(event.target.value));
  };

  const resetImagePosition = () => {
    setImagePosition({ x: 0, y: 0 });
    setScale(1);
    setRotate(0);
  };

  // Mouse wheel zoom functionality with visual feedback
  const handleWheelZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.max(0.5, Math.min(3, prev + delta)));

    // Clear existing timeout
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
  };

  // Mobile pinch-to-zoom support
  const [lastTouchDistance, setLastTouchDistance] = useState<number>(0);

  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      // Two-finger gesture for zoom
      const distance = getTouchDistance(event.touches as unknown as TouchList);
      setLastTouchDistance(distance);
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      // Handle pinch-to-zoom
      event.preventDefault();
      const distance = getTouchDistance(event.touches as unknown as TouchList);

      if (lastTouchDistance > 0) {
        const scaleChange = (distance - lastTouchDistance) * 0.01;
        setScale((prev) => Math.max(0.5, Math.min(3, prev + scaleChange)));
      }

      setLastTouchDistance(distance);
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length < 2) {
      setLastTouchDistance(0);
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

  // Enhanced Facebook-style photo story creation with proper text overlay
  const createPhotoWithTextImage = useCallback(
    async (
      image: HTMLImageElement,
      scale: number,
      rotate: number,
      imagePos: { x: number; y: number },
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

        // Instagram story dimensions
        canvas.width = 1080;
        canvas.height = 1920;

        // Black background like Instagram/Facebook stories
        ctx.fillStyle = "#e5e7eb";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate image scaling to fit canvas properly
        const aspectRatio = image.naturalWidth / image.naturalHeight;
        let drawWidth, drawHeight;

        // Scale image to fill the canvas while maintaining aspect ratio
        if (aspectRatio > canvas.width / canvas.height) {
          drawHeight = canvas.height * scale;
          drawWidth = drawHeight * aspectRatio;
        } else {
          drawWidth = canvas.width * scale;
          drawHeight = drawWidth / aspectRatio;
        }

        // Convert preview positions to canvas coordinates
        const scaleFactorX = canvas.width / 384; // 384px is preview width (w-96)
        const scaleFactorY = canvas.height / 500; // 500px is preview height

        const canvasImageX =
          (canvas.width - drawWidth) / 2 + imagePos.x * scaleFactorX;
        const canvasImageY =
          (canvas.height - drawHeight) / 2 + imagePos.y * scaleFactorY;

        // Draw image with transformations
        ctx.save();

        // Apply rotation around the center of the image
        const imageCenterX = canvasImageX + drawWidth / 2;
        const imageCenterY = canvasImageY + drawHeight / 2;

        ctx.translate(imageCenterX, imageCenterY);
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.translate(-imageCenterX, -imageCenterY);

        ctx.drawImage(image, canvasImageX, canvasImageY, drawWidth, drawHeight);
        ctx.restore();

        // Enhanced text overlay rendering
        if (overlayText.trim()) {
          ctx.save();

          // Text styling with better shadow
          ctx.fillStyle = textColor;
          ctx.font = `${fontSize * 4}px ${fontFamily}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Convert text position from preview to canvas coordinates
          const canvasTextX = canvas.width / 2 + textPos.x * scaleFactorX;
          const canvasTextY = canvas.height / 2 + textPos.y * scaleFactorY;

          // Word wrapping with better line spacing
          const maxWidth = canvas.width * 0.85;
          const words = overlayText.split(" ");
          const lines: string[] = [];

          if (words.length === 0) return;

          let currentLine = words[0] || "";

          for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine + " " + word;
            const metrics = ctx.measureText(testLine);

            if (metrics.width < maxWidth) {
              currentLine = testLine;
            } else {
              lines.push(currentLine);
              currentLine = word;
            }
          }
          lines.push(currentLine);

          // Enhanced line spacing
          const lineHeight = fontSize * 4.8;
          const totalHeight = lines.length * lineHeight;
          const startY = canvasTextY - totalHeight / 2;

          // Draw each line with proper spacing
          lines.forEach((line, index) => {
            const lineY = startY + index * lineHeight;

            // Ensure text stays within canvas bounds
            const clampedY = Math.max(
              lineHeight,
              Math.min(canvas.height - lineHeight, lineY)
            );

            ctx.fillText(line, canvasTextX, clampedY);
          });

          ctx.restore();
        }

        // Convert to high-quality JPEG
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }
            resolve(
              new File([blob], "facebook-story.jpg", { type: "image/jpeg" })
            );
          },
          "image/jpeg",
          0.95 // Higher quality
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

    event.preventDefault();
    event.stopPropagation();

    const storyContainer = event.currentTarget.closest(".story-container");
    if (!storyContainer) return;

    const rect = storyContainer.getBoundingClientRect();
    const newX = event.clientX - rect.left - rect.width / 2 - dragStart.x;
    const newY = event.clientY - rect.top - rect.height / 2 - dragStart.y;

    // Allow text to move anywhere within story bounds
    const maxX = rect.width / 2 - 20;
    const maxY = rect.height / 2 - 20;

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
          imagePosition,
          imageText,
          getFontFamily(textStyle),
          textSize,
          textColor,
          textPosition
        );

        formData.append("storyFiles", processedImage);
        if (imageText) formData.append("textContent", imageText);
        formData.append("textPosition", JSON.stringify(textPosition));
        formData.append("imagePosition", JSON.stringify(imagePosition)); // Add this
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
              <SelectField
                name="textSize"
                placeholder="Select text size"
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                items={textSizes.map((size) => ({
                  value: size.value.toString(),
                  label: size.label,
                }))}
              />
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
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                      textColor === color
                        ? "border-gray-300"
                        : "border-gray-100"
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
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                      selectedBackground === color
                        ? "border-gray-300"
                        : "border-gray-100"
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
                  className="w-80 h-[480px] rounded-3xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
                  style={{ backgroundColor: selectedBackground }}
                >
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    maxLength={220}
                    placeholder="Type your journey here..."
                    className="w-full h-full bg-transparent resize-none border-none outline-none p-4 placeholder:text-white placeholder:text-lg placeholder-opacity-60"
                    style={{
                      color: textColor,
                      fontFamily: getFontFamily(textStyle),
                      fontSize: `${textSize}px`,
                      textAlign: textAlign,
                    }}
                  />
                  <div className="absolute bottom-4 right-4 text-xs opacity-50">
                    {textContent.length}/220
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
          <div className="w-96 rounded-r-2xl p-6 text-gray-800 border-l flex flex-col border-gray-200 max-h-screen overflow-y-auto">
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
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={scale}
                    onChange={handleZoomChange}
                    className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                        ((scale - 0.5) / (3 - 0.5)) * 100
                      }%, #e5e7eb ${
                        ((scale - 0.5) / (3 - 0.5)) * 100
                      }%, #e5e7eb 100%)`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{Math.round(scale * 100)}%</span>
                  <button
                    onClick={resetImagePosition}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Mobile zoom buttons */}
              <div className="md:hidden flex justify-center gap-2 mb-4">
                <button
                  onClick={handleZoomOut}
                  className="flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                  disabled={scale <= 0.5}
                >
                  <ZoomOut size={16} className="text-blue-600" />
                </button>
                <span className="flex items-center px-3 py-2 bg-gray-100 rounded-full text-sm font-medium">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="flex items-center justify-center w-10 h-10 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                  disabled={scale >= 3}
                >
                  <ZoomIn size={16} className="text-blue-600" />
                </button>
              </div>
            </div>

            {/* Text Overlay */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Text Overlay</h3>
              <textarea
                value={imageText}
                onChange={(e) => setImageText(e.target.value)}
                placeholder="Add text overlay... (drag to position)"
                className="w-full bg-white border border-gray-300 p-3 rounded-lg resize-none mb-3 outline-none focus:border-secondary"
                rows={3}
                maxLength={100}
              />
              <div className="text-xs text-gray-500 text-right">
                {imageText.length}/100 characters
              </div>

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
                  <SelectField
                    name="textSize"
                    placeholder="Select text size"
                    value={textSize}
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    items={textSizes.map((size) => ({
                      value: size.value.toString(),
                      label: size.label,
                    }))}
                  />
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
              <div className="relative">
                <div
                  className="story-container w-96 h-[500px] rounded-3xl overflow-hidden relative bg-gray-200  "
                  onWheel={handleWheelZoom}
                  onMouseMove={(e) => {
                    handleImageMouseMove(e);
                    handleTextMouseMove(e);
                  }}
                  onMouseUp={() => {
                    handleImageMouseUp();
                    handleTextMouseUp();
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={(e) => {
                    handleTouchMove(e);
                    handleImageTouchMove(e);
                  }}
                  onTouchEnd={(e) => {
                    handleTouchEnd(e);
                    handleImageTouchEnd();
                    handleTextTouchEnd();
                  }}
                >
                  {previewUrl && (
                    <>
                      <div
                        className="absolute inset-0 cursor-pointer select-none"
                        onMouseDown={handleImageMouseDown}
                        onTouchStart={handleImageTouchStart}
                        style={{
                          transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${scale}) rotate(${rotate}deg)`,
                          transformOrigin: "center center",
                          transition: isImageDragging
                            ? "none"
                            : "transform 0.1s ease-out",
                        }}
                      >
                        <Image
                          ref={imgRef}
                          src={previewUrl}
                          alt="Journey preview"
                          fill
                          className="object-cover"
                          draggable={false}
                        />
                      </div>

                      {/* Text overlay */}
                      {imageText && (
                        <div
                          className={`absolute select-none  cursor-pointer `}
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: `translate(-50%, -50%) translate(${textPosition.x}px, ${textPosition.y}px)`,
                            color: textColor,
                            fontSize: `${textSize}px`,
                            fontFamily: getFontFamily(textStyle),
                            textAlign: "center",
                            wordWrap: "break-word",
                            lineHeight: "1.3",
                            maxWidth: "90%",
                            padding: "12px",
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
                    </>
                  )}
                </div>
              </div>
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
