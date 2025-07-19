import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PictureInPicture,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface VideoCardProps {
  url: string;
  className?: string;
  isVisible?: boolean;
}

const VideoCard = ({
  url,
  className = "h-56 md:h-80",
  isVisible = true,
}: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const playVideo = React.useCallback(async () => {
    if (videoRef.current) {
      try {
        setIsLoading(true);
        if (playPromiseRef.current) {
          await playPromiseRef.current;
        }
        playPromiseRef.current = videoRef.current.play();
        await playPromiseRef.current;
        setIsPlaying(true);
        setError(null);
      } catch (error: unknown) {
        if (error && typeof error === "object" && "name" in error) {
          if ((error as { name?: string }).name === "NotAllowedError") {
            setError("Autoplay blocked. Please interact with the page.");
          } else if ((error as { name?: string }).name !== "AbortError") {
            setError("Play failed");
          }
        }
      } finally {
        setIsLoading(false);
        playPromiseRef.current = null;
      }
    }
  }, []);

  const pauseVideo = React.useCallback(() => {
    if (videoRef.current) {
      if (playPromiseRef.current) {
        playPromiseRef.current.then(() => {
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isVisible && !isPlaying && !isLoading && !userPaused) {
        playVideo();
      } else if (!isVisible && isPlaying && !userPaused) {
        pauseVideo();
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [isVisible, isPlaying, isLoading, userPaused, playVideo, pauseVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleLoadedData = () => {
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      if (isVisible && !userInteracted && !userPaused) {
        playVideo();
      }
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setUserPaused(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setError("Failed to load video");
    };

    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement === video);
    };

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("contextmenu", (e) => e.preventDefault());
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    if (video.readyState >= 1) {
      handleLoadedMetadata();
      setIsLoading(false);
    }

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      video.removeEventListener("contextmenu", (e) => e.preventDefault());
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [playVideo, userInteracted, isVisible, userPaused]);

  const togglePlay = async () => {
    setUserInteracted(true);

    if (videoRef.current && videoRef.current.ended) {
      videoRef.current.currentTime = 0;
      setProgress(0);
      setCurrentTime(0);
      setUserPaused(false);
    }

    if (isPlaying) {
      setUserPaused(true);
      pauseVideo();
    } else {
      setUserPaused(false);
      await playVideo();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
    setUserInteracted(true);
  };

  const toggleFullScreen = async () => {
    if (!videoRef.current) return;
    try {
      if (!isFullScreen) {
        await videoRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      setIsFullScreen(!isFullScreen);
    } catch (err) {
      console.error("Fullscreen toggle failed:", err);
    }
    setUserInteracted(true);
  };

  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error("Picture-in-Picture toggle failed:", err);
    }
    setUserInteracted(true);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
    setUserInteracted(true);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleVideoClick = () => {
    setUserInteracted(true);
    togglePlay();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`relative w-full ${className} rounded-2xl group bg-black overflow-hidden shadow-2xl`}
      onClick={handleVideoClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={url}
        className={`w-full h-full object-cover ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        controls={false}
        controlsList="nodownload"
        playsInline
        muted={isMuted}
        preload="metadata"
        loop={false}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-white text-xs whitespace-nowrap">
              Loading...
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center text-white">
            <div className="text-2xl mb-2">⚠️</div>
            <p className="text-sm mb-3">{error}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setError(null);
                setIsLoading(true);
                setUserPaused(false);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      {isHovered && !isLoading && (
        <div className="absolute cursor-pointer inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10">
          {/* Bottom controls */}
          <div className="absolute bottom-4 left-4 right-4">
            {/* Progress bar */}
            <div
              ref={progressRef}
              className="w-full h-[3px] bg-white bg-opacity-30 rounded-full mb-3 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-primary rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Time display */}
            <div className="flex justify-between items-center text-white text-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="bg-white/40 bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <div className="flex items-center gap-3">
                <div>
                  <span>{formatTime(currentTime)}</span>/
                  <span>{formatTime(duration)}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="bg-white/40 bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70 transition-all cursor-pointer"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePictureInPicture();
                  }}
                  className="bg-white/40 bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70 transition-all cursor-pointer"
                >
                  <PictureInPicture size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullScreen();
                  }}
                  className="bg-white/40 bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70 transition-all cursor-pointer"
                >
                  {isFullScreen ? (
                    <Minimize size={16} />
                  ) : (
                    <Maximize size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;
