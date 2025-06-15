// contexts/VideoContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface VideoContextType {
  currentPlayingVideo: string | null;
  setCurrentPlayingVideo: (videoUrl: string | null) => void;
}

const VideoContext = createContext<VideoContextType>({
  currentPlayingVideo: null,
  setCurrentPlayingVideo: () => {}
});

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoContextProvider');
  }
  return context;
};

interface VideoContextProviderProps {
  children: ReactNode;
}

export const VideoContextProvider = ({ children }: VideoContextProviderProps) => {
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<string | null>(null);

  return (
    <VideoContext.Provider value={{ currentPlayingVideo, setCurrentPlayingVideo }}>
      {children}
    </VideoContext.Provider>
  );
};