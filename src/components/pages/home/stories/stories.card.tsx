"use client";
import { IStory } from "@/types/stories.types";
import Image from "next/image";
import React, { useRef } from "react";

const StoryCard = ({ story }: { story: IStory }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo = story?.mediaIds?.[0]?.mediaType === "video";
  const isImage = story?.mediaIds?.[0]?.mediaType === "image";
  const isMixed = story?.mediaIds?.[0]?.mediaType === "mixed";

  const currentMedia = story?.mediaIds?.[0] || {};
  const isMuted = false;

  return (
    <div className="relative w-full h-[210px] md:h-[240px]  rounded-xl overflow-hidden shadow-lg cursor-pointer">
      {isVideo ? (
        <video
          ref={videoRef}
          src={currentMedia.mediaUrl}
          className="w-full h-full object-cover"
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
              className="w-full h-full object-cover"
              fill
            />
          )}
        </div>
      ) : (
        <div
          className="w-full h-full text-center flex items-center justify-center relative"
          style={{
            backgroundColor: currentMedia.backgroundColor || "#000",
          }}
        >
          {currentMedia.textContent && (
            <h1
              className="text-white text-xl"
              style={{ fontFamily: currentMedia.textFontFamily }}
            >
              {currentMedia.textContent}
            </h1>
          )}
        </div>
      )}
      <div className="absolute p-4 rounded-xl top-0 left-0 right-0 bottom-0 bg-gray-950/30">
        <div className="w-full h-full flex flex-col justify-between">
          <Image
            src={story?.userId?.profileImage}
            alt={story?.userId?.username || "Author"}
            width={48}
            height={48}
            className="size-[48px] rounded-full object-cover ring-2 ring-primary"
          />
          <span className="text-white text-sm font-semibold">
            {story?.userId?.username}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;