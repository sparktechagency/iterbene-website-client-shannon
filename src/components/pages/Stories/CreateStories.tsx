"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera,
  Type,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Palette,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateStoryMutation } from "@/redux/features/stories/storiesApi";
import toast from "react-hot-toast";
import { TError } from "@/types/error";
import { useRouter } from "next/navigation";

type ViewType = "selection" | "text" | "photo";
type TextStyleType = "Clean" | "Bold" | "Typewriter" | "Modern";
type PrivacyType = "public" | "followers" | "custom";
type TextAlign = "left" | "center" | "right";

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  backgroundColor: string;
  fontSize: number;
  fontFamily: string;
  textAlign: TextAlign;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  hasBackground: boolean;
}

const CreateStories: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("selection");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>("");
  const [selectedBackground, setSelectedBackground] = useState<string>("#3B82F6");
  const [textStyle, setTextStyle] = useState<TextStyleType>("Clean");
  const [privacy, setPrivacy] = useState<PrivacyType>("public");
  const [scale, setScale] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [selectedTextLayer, setSelectedTextLayer] = useState<string | null>(null);
  const [showTextColorPalette, setShowTextColorPalette] = useState<boolean>(false);
  const [showTextBackgroundPalette, setShowTextBackgroundPalette] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const [createStory, { isLoading }] = useCreateStoryMutation();

  const backgroundColors: string[] = [
    "#3B82F6", "#EC4899", "#F97316", "#EF4444", "#8B5CF6", "#000000",
    "#7C3AED", "#BE185D", "#EA580C", "#F8BBD9", "#FDE047", "#A78BFA",
    "#6B7280", "#10B981", "#F59E0B", "#F472B6",
  ];

  const textColors: string[] = [
    "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
    "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#FFC0CB", "#A52A2A",
    "#808080", "#FFD700", "#90EE90", "#FF69B4", "#87CEEB", "#DDA0DD",
    "#F0E68C", "#98FB98", "#F5DEB3", "#C0C0C0", "#8FBC8F", "#D2691E",
  ];

  const textStyles: TextStyleType[] = ["Clean", "Bold", "Typewriter", "Modern"];
  const privacyOptions: PrivacyType[] = ["public", "followers", "custom"];

  // Add new text layer
  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text: "",
      x: 0,
      y: 0,
      color: "#FFFFFF",
      backgroundColor: "transparent",
      fontSize: 24,
      fontFamily: getFontFamily(textStyle),
      textAlign: "center",
      isBold: false,
      isItalic: false,
      isUnderline: false,
      hasBackground: false,
    };
    setTextLayers([...textLayers, newLayer]);
    setSelectedTextLayer(newLayer.id);
    setTimeout(() => textInputRef.current?.focus(), 100);
  };

  // Update selected text layer
  const updateTextLayer = (updates: Partial<TextLayer>) => {
    if (!selectedTextLayer) return;
    setTextLayers((layers) =>
      layers.map((layer) =>
        layer.id === selectedTextLayer ? { ...layer, ...updates } : layer
      )
    );
  };

  // Delete text layer
  const deleteTextLayer = (layerId: string) => {
    setTextLayers((layers) => layers.filter((layer) => layer.id !== layerId));
    if (selectedTextLayer === layerId) {
      setSelectedTextLayer(null);
    }
  };

  // Handle text drag
  const handleMouseDown = (e: React.MouseEvent, layerId: string) => {
    e.preventDefault();
    setSelectedTextLayer(layerId);
    setIsDragging(true);
    const layer = textLayers.find((l) => l.id === layerId);
    if (layer && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - layer.x,
        y: e.clientY - rect.top - layer.y,
      });
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !selectedTextLayer || !containerRef.current) return;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      updateTextLayer({ x: newX, y: newY });
    },
    [isDragging, selectedTextLayer, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle click outside for settings and text layer deselection
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelectedTextLayer(null);
        setShowTextColorPalette(false);
        setShowTextBackgroundPalette(false);
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
          setTextLayers([]);
          setSelectedTextLayer(null);
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
    setSelectedBackground("#3B82F6");
    setPrivacy("public");
    setScale(1);
    setRotate(0);
    setTextLayers([]);
    setSelectedTextLayer(null);
    setShowTextColorPalette(false);
    setShowTextBackgroundPalette(false);
    setShowSettings(false);
  };

  const getProcessedImage = useCallback(
    async (
      image: HTMLImageElement,
      scale: number,
      rotate: number,
      textLayers: TextLayer[]
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

      textLayers.forEach((layer) => {
        if (layer.text) {
          ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          const fontSize = layer.fontSize * pixelRatio;
          let fontStyle = `${fontSize}px ${layer.fontFamily}`;
          if (layer.isBold) fontStyle = `bold ${fontStyle}`;
          if (layer.isItalic) fontStyle = `italic ${fontStyle}`;
          ctx.font = fontStyle;
          ctx.textAlign = layer.textAlign;
          ctx.textBaseline = "middle";

          const x = (canvas.width / 2 + layer.x * pixelRatio);
          const y = (canvas.height / 2 + layer.y * pixelRatio);

          if (layer.hasBackground && layer.backgroundColor !== "transparent") {
            const textMetrics = ctx.measureText(layer.text);
            const textWidth = textMetrics.width;
            const textHeight = fontSize;
            ctx.fillStyle = layer.backgroundColor;
            ctx.fillRect(
              x - (layer.textAlign === "center" ? textWidth / 2 : layer.textAlign === "left" ? 0 : textWidth) - 10,
              y - textHeight / 2 - 5,
              textWidth + 20,
              textHeight + 10
            );
          }

          ctx.fillStyle = layer.color;
          ctx.fillText(layer.text, x, y);

          if (layer.isUnderline) {
            const textMetrics = ctx.measureText(layer.text);
            ctx.strokeStyle = layer.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            const underlineXStart = x - (layer.textAlign === "center" ? textMetrics.width / 2 : layer.textAlign === "left" ? 0 : textMetrics.width);
            ctx.moveTo(underlineXStart, y + fontSize / 3);
            ctx.lineTo(underlineXStart + textMetrics.width, y + fontSize / 3);
            ctx.stroke();
          }
        }
      });

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) reject(new Error("Failed to create blob"));
            else resolve(new File([blob], "processed-image.jpg", { type: "image/jpeg" }));
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
        const processedImage = await getProcessedImage(imgRef.current, scale, rotate, textLayers);
        formData.append("storyFiles", processedImage);
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
      case "Bold": return "Arial Black";
      case "Typewriter": return "Courier New";
      case "Modern": return "Helvetica";
      default: return "Arial";
    }
  };

  const getSelectedLayer = () => textLayers.find((layer) => layer.id === selectedTextLayer);

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
              whileHover={{ scale: 1.05 }}
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
              whileHover={{ scale: 1.05 }}
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
      <section className="w-full bg-gray-50 rounded-2xl">
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
                            privacy === option ? "bg-gray-300" : "hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setPrivacy(option);
                            setShowSettings(false);
                          }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="mb-6">
              <label className="text-sm font-medium mb-3 block">Font Style</label>
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
                className="px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
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
    const selectedLayer = getSelectedLayer();
    return (
      <section className="w-full bg-gray-50 rounded-2xl">
        <div className="flex flex-row-reverse">
          <div className="w-80 rounded-r-2xl p-6 text-gray-800 border-l flex flex-col border-gray-200 max-h-[600px] overflow-y-auto">
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
                            privacy === option ? "bg-gray-300" : "hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setPrivacy(option);
                            setShowSettings(false);
                          }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
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
              <button
                onClick={addTextLayer}
                className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Text
              </button>
            </div>
            {selectedLayer && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Edit Text</h3>
                <textarea
                  ref={textInputRef}
                  value={selectedLayer.text}
                  onChange={(e) => updateTextLayer({ text: e.target.value })}
                  placeholder="Enter your text"
                  className="w-full bg-white border border-gray-300 p-3 rounded-lg resize-none mb-3"
                  rows={3}
                />
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Font Size</label>
                    <input
                      type="range"
                      min="12"
                      max="48"
                      value={selectedLayer.fontSize}
                      onChange={(e) => updateTextLayer({ fontSize: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">{selectedLayer.fontSize}px</span>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Font Style</label>
                    <select
                      value={selectedLayer.fontFamily}
                      onChange={(e) => updateTextLayer({ fontFamily: e.target.value })}
                      className="w-full bg-white border border-gray-300 p-2 rounded text-sm"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Arial Black">Arial Black</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Text Alignment</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateTextLayer({ textAlign: "left" })}
                        className={`p-2 rounded ${selectedLayer.textAlign === "left" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                      >
                        <AlignLeft size={16} />
                      </button>
                      <button
                        onClick={() => updateTextLayer({ textAlign: "center" })}
                        className={`p-2 rounded ${selectedLayer.textAlign === "center" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                      >
                        <AlignCenter size={16} />
                      </button>
                      <button
                        onClick={() => updateTextLayer({ textAlign: "right" })}
                        className={`p-2 rounded ${selectedLayer.textAlign === "right" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                      >
                        <AlignRight size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Text Style</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateTextLayer({ isBold: !selectedLayer.isBold })}
                        className={`p-2 rounded ${selectedLayer.isBold ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                      >
                        <Bold size={16} />
                      </button>
                      <button
                        onClick={() => updateTextLayer({ isItalic: !selectedLayer.isItalic })}
                        className={`p-2 rounded ${selectedLayer.isItalic ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                      >
                        <Italic size={16} />
                      </button>
                      <button
                        onClick={() => updateTextLayer({ isUnderline: !selectedLayer.isUnderline })}
                        className={`p-2 rounded ${selectedLayer.isUnderline ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                      >
                        <Underline size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowTextColorPalette(!showTextColorPalette)}
                        className="p-2 bg-gray-200 rounded"
                      >
                        <Palette size={16} />
                      </button>
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-300"
                        style={{ backgroundColor: selectedLayer.color }}
                      />
                    </div>
                    {showTextColorPalette && (
                      <div className="grid grid-cols-6 gap-1 mt-2 p-2 bg-white border rounded">
                        {textColors.map((color, index) => (
                          <button
                            key={index}
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              updateTextLayer({ color });
                              setShowTextColorPalette(false);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Text Background</label>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedLayer.hasBackground}
                        onChange={(e) => updateTextLayer({ hasBackground: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-xs">Enable background</span>
                    </div>
                    {selectedLayer.hasBackground && (
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowTextBackgroundPalette(!showTextBackgroundPalette)}
                            className="p-2 bg-gray-200 rounded"
                          >
                            <Palette size={16} />
                          </button>
                          <div
                            className="w-8 h-8 rounded border-2 border-gray-300"
                            style={{ backgroundColor: selectedLayer.backgroundColor }}
                          />
                        </div>
                        {showTextBackgroundPalette && (
                          <div className="grid grid-cols-6 gap-1 mt-2 p-2 bg-white border rounded">
                            {textColors.map((color, index) => (
                              <button
                                key={index}
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  updateTextLayer({ backgroundColor: color });
                                  setShowTextBackgroundPalette(false);
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTextLayer(selectedLayer.id)}
                    className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete Text
                  </button>
                </div>
              </div>
            )}
            <div className="flex justify-between mt-auto">
              <button
                onClick={resetToSelection}
                className="px-6 py-2 text-gray-400 cursor-pointer border rounded-lg"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleShareStory}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
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
                ref={containerRef}
                className="w-96 h-[550px] rounded-3xl overflow-hidden relative bg-gray-200"
              >
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
                    {textLayers.map((layer) => (
                      <div
                        key={layer.id}
                        onMouseDown={(e) => handleMouseDown(e, layer.id)}
                        style={{
                          position: "absolute",
                          left: `calc(50% + ${layer.x}px)`,
                          top: `calc(50% + ${layer.y}px)`,
                          transform: "translate(-50%, -50%)",
                          color: layer.color,
                          fontSize: `${layer.fontSize}px`,
                          fontFamily: layer.fontFamily,
                          textAlign: layer.textAlign,
                          fontWeight: layer.isBold ? "bold" : "normal",
                          fontStyle: layer.isItalic ? "italic" : "normal",
                          textDecoration: layer.isUnderline ? "underline" : "none",
                          backgroundColor: layer.hasBackground ? layer.backgroundColor : "transparent",
                          padding: layer.hasBackground ? "8px 12px" : "0",
                          borderRadius: layer.hasBackground ? "8px" : "0",
                          cursor: selectedTextLayer === layer.id ? "move" : "pointer",
                          userSelect: "none",
                          textShadow: "0 0 4px rgba(0,0,0,0.5)",
                          whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                          maxWidth: "300px",
                          minWidth: "100px",
                          border: selectedTextLayer === layer.id ? "2px dashed #3B82F6" : "none",
                          boxSizing: "border-box",
                          zIndex: selectedTextLayer === layer.id ? 10 : 1,
                        }}
                      >
                        {layer.text || "Tap to type"}
                      </div>
                    ))}
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