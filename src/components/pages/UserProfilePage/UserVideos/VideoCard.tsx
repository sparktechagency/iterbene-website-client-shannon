// "use client";
// import { Pause } from "lucide-react";
// import React, { useEffect, useRef, useState } from "react";
// import { FiPlayCircle } from "react-icons/fi";
// import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
// const VideoCard = ({
//   url,
//   className = "h-56 md:h-80",
// }: {
//   url: string;
//   className?: string;
// }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const progressRef = useRef<HTMLDivElement>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [showControls, setShowControls] = useState(false);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const handleTimeUpdate = () => {
//       setProgress((video.currentTime / video.duration) * 100);
//       setCurrentTime(video.currentTime);
//     };

//     const handleLoadedMetadata = () => {
//       if (video.duration && !isNaN(video.duration)) {
//         setDuration(video.duration);
//       }
//     };

//     const handleEnded = () => {
//       setIsPlaying(false);
//       setShowControls(false);
//       video.currentTime = 0;
//       setProgress(0);
//       setCurrentTime(0);
//     };

//     video.addEventListener("contextmenu", (e) => e.preventDefault());
//     video.addEventListener("timeupdate", handleTimeUpdate);
//     video.addEventListener("loadedmetadata", handleLoadedMetadata);
//     video.addEventListener("ended", handleEnded);

//     if (video.readyState >= 1) {
//       handleLoadedMetadata();
//     }

//     return () => {
//       video.removeEventListener("timeupdate", handleTimeUpdate);
//       video.removeEventListener("loadedmetadata", handleLoadedMetadata);
//       video.removeEventListener("ended", handleEnded);
//       video.removeEventListener("contextmenu", (e) => e.preventDefault());
//     };
//   }, []);

//   const togglePlay = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//         setShowControls(false);
//       } else {
//         videoRef.current.play();
//         setShowControls(true);
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!progressRef.current || !videoRef.current) return;

//     const rect = progressRef.current.getBoundingClientRect();
//     const pos = (e.clientX - rect.left) / rect.width;
//     videoRef.current.currentTime = pos * videoRef.current.duration;
//   };
//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds.toString().padStart(2, "0")}`;
//   };

//   return (
//     <div className="relative w-full rounded-xl group" onClick={togglePlay}>
//       {/* Show thumbnail if the video hasn't started */}
//       {/* Video Player */}
//       <video
//         ref={videoRef}
//         src={url}
//         className={`w-full ${className} object-cover rounded-xl`}
//         controls={false}
//         controlsList="nodownload"
//         playsInline
//       />

//       {/* Centered Play Icon (Visible when paused) */}
//       {!isPlaying && (
//         <div className="absolute inset-0 flex items-center justify-center">
//           <FiPlayCircle
//             color="#ECFCFA"
//             onClick={togglePlay}
//             size={80}
//             strokeWidth={1}
//             className="cursor-pointer"
//           />
//         </div>
//       )}

//       {/* Custom Controls (Visible after video starts and on hover) */}
//       <div
//         className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t rounded-xl from-black/70 to-transparent p-4 transition-opacity duration-380 ${
//           showControls ? "opacity-100" : "opacity-0"
//         }`}
//       >
//         <div className="flex items-center justify-between gap-3 mb-3">
//           <span className="text-white">{formatTime(currentTime)}</span>
//           <div
//             ref={progressRef}
//             className="w-full h-1 bg-[#ECFCFA] rounded  cursor-pointer"
//             onClick={handleProgressClick}
//           >
//             <div
//               className="h-full bg-[#40E0D0] rounded-full"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//           <span className="text-white">{formatTime(duration || 0)}</span>
//         </div>

//         <div className="flex items-center justify-center gap-3">
//           <button>
//             <HiChevronDoubleLeft size={38} className="text-[#ECFCFA]" />
//           </button>
//           <button onClick={togglePlay}>
//             {isPlaying ? (
//               <Pause size={35} className="text-[#ECFCFA]" />
//             ) : (
//               <FiPlayCircle size={38} className="text-[#ECFCFA]" />
//             )}
//           </button>
//           <button>
//             <HiChevronDoubleRight size={38} className="text-white" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default VideoCard;

// components/VideoCard.tsx
"use client";
import { Pause } from "lucide-react";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FiPlayCircle } from "react-icons/fi";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";

export interface VideoCardRef {
  play: () => void;
  pause: () => void;
  isPlaying: boolean;
}

interface VideoCardProps {
  url: string;
  className?: string;
  autoplay?: boolean;
  onPlayStateChange?: (isPlaying: boolean, videoUrl: string) => void;
}

const VideoCard = forwardRef<VideoCardRef, VideoCardProps>(
  (
    { url, className = "h-56 md:h-80", autoplay = false, onPlayStateChange },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      play: () => {
        if (videoRef.current && !isPlaying) {
          playVideo();
        }
      },
      pause: () => {
        if (videoRef.current && isPlaying) {
          pauseVideo();
        }
      },
      isPlaying,
    }));

    const playVideo = React.useCallback(async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
          if (!userInteracted) {
            setShowControls(false); // Hide controls for autoplay
          }
          onPlayStateChange?.(true, url);
        } catch (error) {
          console.log("Autoplay failed:", error);
        }
      }
    }, [onPlayStateChange, url, userInteracted]);

    const pauseVideo = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowControls(false);
        onPlayStateChange?.(false, url);
      }
    };

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
        onPlayStateChange?.(false, url);
      };

      const handleCanPlay = () => {
        if (autoplay && !userInteracted) {
          playVideo();
        }
      };

      video.addEventListener("contextmenu", (e) => e.preventDefault());
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("ended", handleEnded);
      video.addEventListener("canplay", handleCanPlay);

      if (video.readyState >= 1) {
        handleLoadedMetadata();
      }

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("ended", handleEnded);
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("contextmenu", (e) => e.preventDefault());
      };
    }, [autoplay, url, onPlayStateChange, playVideo, userInteracted]);

    const togglePlay = () => {
      setUserInteracted(true);
      if (isPlaying) {
        pauseVideo();
      } else {
        playVideo();
        setShowControls(true);
      }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!progressRef.current || !videoRef.current) return;

      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleVideoClick = () => {
      if (!userInteracted || !isPlaying) {
        togglePlay();
      }
    };

    return (
      <div
        className="relative w-full rounded-xl group"
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          src={url}
          className={`w-full ${className} object-cover rounded-xl`}
          controls={false}
          controlsList="nodownload"
          playsInline
          muted={!userInteracted} // Muted for autoplay compliance
          loop={false}
        />

        {/* Centered Play Icon (Visible when paused or user hasn't interacted) */}
        {(!isPlaying || !userInteracted) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FiPlayCircle
              color="#ECFCFA"
              size={80}
              strokeWidth={1}
              className="cursor-pointer transition-transform hover:scale-110"
            />
          </div>
        )}

        {/* Muted indicator for autoplay */}
        {isPlaying && !userInteracted && (
          <div className="absolute top-4 right-4 bg-black/70 rounded-full p-2">
            <span className="text-white text-xs">🔇</span>
          </div>
        )}

        {/* Custom Controls (Visible after user interaction) */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t rounded-xl from-black/70 to-transparent p-4 transition-opacity duration-300 ${
            showControls && userInteracted ? "opacity-100" : "opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-white text-sm">
              {formatTime(currentTime)}
            </span>
            <div
              ref={progressRef}
              className="w-full h-1 bg-white/30 rounded cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-[#40E0D0] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white text-sm">
              {formatTime(duration || 0)}
            </span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add rewind functionality if needed
              }}
              className="hover:scale-110 transition-transform"
            >
              <HiChevronDoubleLeft size={28} className="text-[#ECFCFA]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="hover:scale-110 transition-transform"
            >
              {isPlaying ? (
                <Pause size={32} className="text-[#ECFCFA]" />
              ) : (
                <FiPlayCircle size={32} className="text-[#ECFCFA]" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add fast forward functionality if needed
              }}
              className="hover:scale-110 transition-transform"
            >
              <HiChevronDoubleRight size={28} className="text-[#ECFCFA]" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

VideoCard.displayName = "VideoCard";

export default VideoCard;
