"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";

interface Media {
  url: string;
  type: "image" | "video";
}

interface Story {
  id: number;
  media: Media[];
  authorName: string;
  authorImage: string;
  text?: string;
  textColor?: string;
  font?: string;
  backgroundColor?: string;
}

interface StoriesModalProps {
  stories: Story[];
  selectedStoryIndex: number;
  setSelectedStoryIndex: (index: number) => void;
  onClose: () => void;
}

const StoriesModal: React.FC<StoriesModalProps> = ({
  stories,
  selectedStoryIndex,
  setSelectedStoryIndex,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const duration = 5000;

  const currentStory = stories[selectedStoryIndex];
  const totalMedia = currentStory.media.length;

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentImageIndex < totalMedia - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
            return 0;
          } else {
            if (selectedStoryIndex === stories.length - 1) {
              onClose();
              return 0;
            } else {
              setCurrentImageIndex(0);
              setProgress(0);
              setSelectedStoryIndex(selectedStoryIndex + 1);
              return 0;
            }
          }
        }
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentImageIndex, totalMedia, isPaused, selectedStoryIndex, stories.length, onClose, setSelectedStoryIndex]);

  useEffect(() => {
    if (currentStory.media[currentImageIndex].type === "video" && videoRef.current) {
      setIsPaused(true);
      const video = videoRef.current;
      video.onended = () => {
        setIsPaused(false);
        setProgress(100);
      };
      video.play().catch((error) => {
        console.error("Video playback failed:", error);
      });
    }
  }, [currentImageIndex, currentStory]);

  const handleNextMedia = () => {
    if (currentImageIndex < totalMedia - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setProgress(0);
      setIsPaused(false);
    } else if (selectedStoryIndex < stories.length - 1) {
      setCurrentImageIndex(0);
      setProgress(0);
      setIsPaused(false);
      setSelectedStoryIndex(selectedStoryIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePreviousMedia = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setProgress(0);
      setIsPaused(false);
    } else if (selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
      setCurrentImageIndex(stories[selectedStoryIndex - 1].media.length - 1);
      setProgress(0);
      setIsPaused(false);
    } else {
      setSelectedStoryIndex(stories.length - 1);
      setCurrentImageIndex(stories[stories.length - 1].media.length - 1);
      setProgress(0);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    if (currentStory.media[currentImageIndex].type === "video" && videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    if (currentStory.media[currentImageIndex].type === "video" && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video playback failed:", error);
      });
    }
  };

  const handleReact = () => {
    setReaction(reaction ? null : "liked");
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log(`Sending message: ${message}`);
      setMessage("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md h-[80vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white z-50 bg-black/50 rounded-full p-2 cursor-pointer hover:bg-black/70 transition"
        >
          <X size={24} />
        </button>

        <div className="absolute top-2 left-0 right-0 flex gap-1 px-4 z-10">
          {currentStory.media.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-gray-500 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white"
                style={{
                  width:
                    index === currentImageIndex
                      ? `${progress}%`
                      : index < currentImageIndex
                      ? "100%"
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        <div
          className="relative w-full h-full"
          style={{ backgroundColor: currentStory.backgroundColor || "#000000" }}
        >
          {currentStory.media[currentImageIndex].type === "image" ? (
            <Image
              src={currentStory.media[currentImageIndex].url}
              alt="Story Image"
              width={400}
              height={600}
              className="object-contain w-full h-full"
            />
          ) : (
            <video
              ref={videoRef}
              src={currentStory.media[currentImageIndex].url}
              className="object-contain w-full h-full"
              playsInline
            />
          )}

          <div className="absolute top-0 left-0 right-0 p-4 flex items-center gap-3 bg-gradient-to-b from-black/50 to-transparent">
            <Image
              src={currentStory.authorImage}
              alt={currentStory.authorName}
              width={32}
              height={32}
              className="size-8 rounded-full object-cover"
            />
            <div>
              <p className="text-white text-sm font-semibold">
                {currentStory.authorName}
              </p>
              <p className="text-gray-300 text-xs">Posted recently</p>
            </div>
          </div>

          {currentStory.text && (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
              style={{
                color: currentStory.textColor || "#ffffff",
                fontFamily: currentStory.font || "Inter",
              }}
            >
              <p className="text-2xl font-bold">{currentStory.text}</p>
            </div>
          )}

          <div
            className="absolute top-0 left-0 w-1/3 h-full"
            onMouseDown={handlePause}
            onMouseUp={handleResume}
            onTouchStart={handlePause}
            onTouchEnd={handleResume}
            onClick={handlePreviousMedia}
          />
          <div
            className="absolute top-0 right-0 w-1/3 h-full"
            onMouseDown={handlePause}
            onMouseUp={handleResume}
            onTouchStart={handlePause}
            onTouchEnd={handleResume}
            onClick={handleNextMedia}
          />
        </div>

        <div className="absolute bottom-4 left-0 right-0 px-4 flex items-center gap-3 z-10">
          <button onClick={handleReact} className="text-white cursor-pointer">
            <Heart
              size={24}
              fill={reaction === "liked" ? "white" : "none"}
              className={reaction === "liked" ? "text-white" : "text-gray-400"}
            />
          </button>
          <div className="flex-1 flex items-center bg-white/20 rounded-full px-4 py-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Reply to this story..."
              className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none"
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <button onClick={handleSendMessage} className="text-white">
              <Send size={20} />
            </button>
          </div>
        </div>

        <button
          onClick={handlePreviousMedia}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-2 cursor-pointer hover:bg-black/70 transition"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={handleNextMedia}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-2 cursor-pointer hover:bg-black/70 transition"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
};

export default StoriesModal;