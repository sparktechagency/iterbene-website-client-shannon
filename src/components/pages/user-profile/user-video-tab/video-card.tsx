  "use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";
import { FiPlayCircle } from "react-icons/fi";
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
      <div
        className="relative w-full rounded-lg group"
        onClick={togglePlay}
      >
        {/* Show thumbnail if the video hasn't started */}
        {/* Video Player */}
        <video
          ref={videoRef}
          src={url}
          className="w-full h-56 md:h-96 lg:h-[450px] object-cover rounded-lg"
          onClick={togglePlay}
          controls={false}
          controlsList="nodownload"
          playsInline
        />

        {/* Centered Play Icon (Visible when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FiPlayCircle color="#ECFCFA" onClick={togglePlay} size={80} strokeWidth={1.5} className="cursor-pointer" />
          </div>
        )}

        {/* Custom Controls (Visible after video starts and on hover) */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t rounded-lg from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"
            }`}
        >
          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="w-full h-1 bg-[#A4A5AA] rounded-full mb-4 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white  transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white  transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-white"
                />
              </div>

              {/* Time Display */}
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="text-white  transition-colors cursor-pointer"
              >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  };
  export default VideoCard