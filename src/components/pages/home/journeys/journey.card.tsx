"use client";
import { IStory } from "@/types/stories.types";
import Image from "next/image";
import React, { useRef } from "react";
import useUser from "@/hooks/useUser"; // Adjust import path as needed

const JourneyCard = ({ story }: { story: IStory }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const user = useUser(); // Get current user data

  const isVideo = story?.mediaIds?.[0]?.mediaType === "video";
  const isImage = story?.mediaIds?.[0]?.mediaType === "image";
  const isMixed = story?.mediaIds?.[0]?.mediaType === "mixed";
  const isOwnStory = story?.userId?._id === user?._id; // Check if this is the current user's story

  const currentMedia = story?.mediaIds?.[0] || {};
  const isMuted = false;

  return (
    <div className="relative w-full h-[190px] md:h-[210px] rounded-xl overflow-hidden shadow-lg cursor-pointer group">
      {isVideo ? (
        <video
          ref={videoRef}
          src={currentMedia.mediaUrl}
          className="w-full h-full object-cover transition-transform duration-300"
          autoPlay
          muted={isMuted}
          playsInline
        />
      ) : isImage || isMixed ? (
        <div
          className="w-full h-full flex items-center justify-center relative"
          style={{
            backgroundColor: currentMedia.backgroundColor || "#000",
          }}
        >
          {currentMedia?.mediaUrl && (
            <Image
              src={currentMedia.mediaUrl}
              alt="Story content"
              className="w-full h-full object-cover transition-transform duration-300"
              fill
            />
          )}
        </div>
      ) : (
        <div
          className="w-full h-full text-center flex items-center justify-center relative p-2"
          style={{
            backgroundColor: currentMedia.backgroundColor || "#000",
          }}
        >
          {currentMedia.textContent && (
            <h1
              className="text-white text-sm md:text-base font-semibold"
              style={{ fontFamily: currentMedia.textFontFamily }}
            >
              {currentMedia.textContent}
            </h1>
          )}
        </div>
      )}
      <div className="absolute p-2 md:p-4 rounded-xl top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent">
        <div className="w-full h-full flex flex-col justify-between">
          <Image
            src={story?.userId?.profileImage}
            alt={isOwnStory ? "Your Journey" : story?.userId?.username || "Author"}
            width={40}
            height={40}
            className="size-10 rounded-full object-cover ring-2 ring-primary"
          />
          <span className="text-white text-xs md:text-sm font-semibold">
            {isOwnStory ? "Your Journey" : story?.userId?.username}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JourneyCard;