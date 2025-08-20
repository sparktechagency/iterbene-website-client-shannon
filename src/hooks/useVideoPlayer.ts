import { useCallback, useEffect, useRef, useState } from "react";

// Global video manager to ensure only one video plays at a time
class GlobalVideoManager {
  private currentVideo: HTMLVideoElement | null = null;
  private listeners: Set<(video: HTMLVideoElement | null) => void> = new Set();

  setCurrentVideo(video: HTMLVideoElement | null) {
    if (this.currentVideo && this.currentVideo !== video) {
      this.currentVideo.pause();
      this.currentVideo.currentTime = 0;
    }
    this.currentVideo = video;
    this.notifyListeners();
  }

  getCurrentVideo() {
    return this.currentVideo;
  }

  addListener(listener: (video: HTMLVideoElement | null) => void) {
    this.listeners.add(listener);
  }

  removeListener(listener: (video: HTMLVideoElement | null) => void) {
    this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentVideo));
  }

  pauseAll() {
    if (this.currentVideo) {
      this.currentVideo.pause();
      this.currentVideo = null;
      this.notifyListeners();
    }
  }
}

const globalVideoManager = new GlobalVideoManager();

interface UseVideoPlayerOptions {
  videoId: string;
  autoplay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: () => void;
}

export const useVideoPlayer = ({
  videoId,
  autoplay = false,
  onPlay,
  onPause,
  onEnded,
  onError,
}: UseVideoPlayerOptions) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Handle global video state changes
  useEffect(() => {
    const handleGlobalVideoChange = (currentVideo: HTMLVideoElement | null) => {
      if (videoRef.current && videoRef.current !== currentVideo) {
        setIsPlaying(false);
      }
    };

    globalVideoManager.addListener(handleGlobalVideoChange);
    return () => globalVideoManager.removeListener(handleGlobalVideoChange);
  }, []);

  // Video event handlers
  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      globalVideoManager.setCurrentVideo(videoRef.current);
      setIsPlaying(true);
      setError(null);
      onPlay?.();
    }
  }, [onPlay]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    onPause?.();
  }, [onPause]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    globalVideoManager.setCurrentVideo(null);
    onEnded?.();
  }, [onEnded]);

  const handleError = useCallback(() => {
    setError("Video failed to load");
    setIsLoading(false);
    setIsPlaying(false);
    onError?.();
  }, [onError]);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const handleLoadedData = useCallback(() => {
    setIsLoading(false);
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  // Control functions
  const play = useCallback(async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
      } catch (error) {
        console.error("Failed to play video:", error);
        setError("Failed to play video");
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const restart = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.load(); // Force reload the video
      setError(null);
      setCurrentTime(0);
    }
  }, []);

  const seek = useCallback(
    (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(0, Math.min(time, duration));
      }
    },
    [duration]
  );

  const setVideoVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (videoRef.current) {
      videoRef.current.volume = clampedVolume;
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
    }
  }, [isMuted]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Setup video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial properties
    video.volume = volume;
    video.muted = isMuted;

    // Add event listeners
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);

    // Autoplay if enabled
    if (autoplay) {
      play();
    }

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [
    videoId,
    volume,
    isMuted,
    autoplay,
    play,
    handlePlay,
    handlePause,
    handleEnded,
    handleError,
    handleLoadStart,
    handleLoadedData,
    handleTimeUpdate,
  ]);

  return {
    videoRef,
    isPlaying,
    isLoading,
    error,
    duration,
    currentTime,
    volume,
    isMuted,
    // Control functions
    play,
    pause,
    restart,
    seek,
    setVolume: setVideoVolume,
    toggleMute,
    togglePlayPause,
    // Utility functions
    formatTime: (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
    getProgress: () => (duration ? (currentTime / duration) * 100 : 0),
  };
};

// Hook for pausing all videos globally
export const useGlobalVideoControl = () => {
  const pauseAllVideos = useCallback(() => {
    globalVideoManager.pauseAll();
  }, []);

  return { pauseAllVideos };
};

export default useVideoPlayer;
