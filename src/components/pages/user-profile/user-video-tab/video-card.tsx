"use client";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FiPlayCircle } from "react-icons/fi";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
const VideoCard = ({ url }: { url: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(false);
      video.currentTime = 0;
      setProgress(0);
      setCurrentTime(0);
    };

    video.addEventListener("contextmenu", (e) => e.preventDefault());
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setShowControls(false);
      } else {
        videoRef.current.play();
        setShowControls(true);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full rounded-xl group" onClick={togglePlay}>
      {/* Show thumbnail if the video hasn't started */}
      {/* Video Player */}
      <video
        ref={videoRef}
        src={url}
        className="w-full h-56 md:h-96 lg:h-[450px] object-cover rounded-xl"
        controls={false}
        controlsList="nodownload"
        playsInline
      />

      {/* Centered Play Icon (Visible when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <FiPlayCircle
            color="#ECFCFA"
            onClick={togglePlay}
            size={80}
            strokeWidth={1}
            className="cursor-pointer"
          />
        </div>
      )}

      {/* Custom Controls (Visible after video starts and on hover) */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t rounded-xl from-black/70 to-transparent p-4 transition-opacity duration-380 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-white">{formatTime(currentTime)}</span>
          <div
            ref={progressRef}
            className="w-full h-1 bg-[#ECFCFA] rounded  cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-[#40E0D0] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-white">{formatTime(duration || 0)}</span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button>
            <HiChevronDoubleLeft size={38} className="text-[#ECFCFA]" />
          </button>
          <button onClick={togglePlay}>
            {isPlaying ? (
              <Pause size={35} className="text-[#ECFCFA]" />
            ) : (
              <FiPlayCircle size={38} className="text-[#ECFCFA]" />
            )}
          </button>
          <button>
            <HiChevronDoubleRight size={38} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default VideoCard;
