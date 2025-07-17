import React, { createContext, useContext, useState, ReactNode } from "react";

interface VideoContextType {
  currentlyPlayingVideo: string | null;
  setCurrentlyPlayingVideo: (videoId: string | null) => void;
  pauseAllVideos: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentlyPlayingVideo, setCurrentlyPlayingVideo] = useState<
    string | null
  >(null);

  const pauseAllVideos = () => {
    setCurrentlyPlayingVideo(null);
  };

  return (
    <VideoContext.Provider
      value={{
        currentlyPlayingVideo,
        setCurrentlyPlayingVideo,
        pauseAllVideos,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
};
