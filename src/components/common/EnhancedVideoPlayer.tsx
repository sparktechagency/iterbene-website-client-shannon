"use client";

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  AlertCircle,
  Loader
} from 'lucide-react';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';

interface EnhancedVideoPlayerProps {
  src: string;
  videoId: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  showRestartButton?: boolean;
  showVolumeControl?: boolean;
}

const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({
  src,
  videoId,
  poster,
  className = '',
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  playsInline = true,
  onPlay,
  onPause,
  onEnded,
  showRestartButton = true,
  showVolumeControl = true,
}) => {
  const {
    videoRef,
    isPlaying,
    isLoading,
    error,
    duration,
    currentTime,
    volume,
    isMuted,
    restart,
    seek,
    setVolume,
    toggleMute,
    togglePlayPause,
    formatTime,
    getProgress,
  } = useVideoPlayer({
    videoId,
    autoplay,
    onPlay,
    onPause,
    onEnded,
  });

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    
    // Use offsetX for better performance and avoid forced reflow
    const offsetX = e.nativeEvent.offsetX;
    const width = e.currentTarget.offsetWidth;
    const percentage = offsetX / width;
    const newTime = percentage * duration;
    seek(newTime);
  }, [duration, seek]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  }, [setVolume]);

  const handleFullscreen = useCallback(() => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  }, [videoRef]);

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden group ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload="metadata"
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <Loader className="w-8 h-8 text-white animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Overlay */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 text-white p-4"
          >
            <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
            <p className="text-center mb-4">{error}</p>
            {showRestartButton && (
              <button
                onClick={restart}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restart Video
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      {controls && !error && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Center Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="bg-black/50 text-white rounded-full p-4 hover:bg-black/70 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div
                onClick={handleProgressClick}
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer group/progress"
              >
                <div
                  className="h-full bg-primary rounded-full transition-all duration-150 group-hover/progress:bg-primary/80"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/80 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button
                  onClick={togglePlayPause}
                  className="text-white hover:text-primary transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                {/* Restart */}
                {showRestartButton && (
                  <button
                    onClick={restart}
                    className="text-white hover:text-primary transition-colors"
                    title="Restart video"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}

                {/* Volume Control */}
                {showVolumeControl && (
                  <div className="flex items-center gap-2 group/volume">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-primary transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <div className="w-0 group-hover/volume:w-20 overflow-hidden transition-all duration-300">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={handleFullscreen}
                className="text-white hover:text-primary transition-colors"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Click to Play (when controls are disabled) */}
      {!controls && !error && (
        <div
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
        >
          {!isPlaying && (
            <div className="bg-black/50 text-white rounded-full p-6 hover:bg-black/70 transition-colors">
              <Play className="w-12 h-12 ml-1" />
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #40e0d0;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #40e0d0;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default EnhancedVideoPlayer;