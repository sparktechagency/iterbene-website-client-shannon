"use client";
import React from "react";
import Image from "next/image";

// Define the type for story data
interface StoryCardProps {
  image: string;
  authorName: string;
  authorImage: string;
}

const StoryCard: React.FC<StoryCardProps> = ({
  image,
  authorName,
  authorImage,
}) => {
  return (
    <div className="relative w-full h-[250px] rounded-lg overflow-hidden shadow-lg cursor-pointer">
      <Image
        src={image}
        alt="Story Image"
        width={200}
        height={200}
        className="object-cover w-full h-full rounded-lg"
      />
      <div className="absolute p-4 rounded-lg top-0 left-0 right-0 bottom-0 bg-gray-950/30 ">
        <div className="w-full h-full flex flex-col justify-between">
          <Image
            src={authorImage}
            alt={authorName}
            width={48}
            height={48}
            className="size-[48px] rounded-full object-cover ring-2 ring-primary"
          />
          <span className="text-white text-sm font-semibold">{authorName}</span>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
