"use client";
import Image from "next/image";
import { IStory } from "./stories";

const StoryCard = ({stroy}: {stroy: IStory}) => {
  return (
    <div className="relative w-full h-[250px] rounded-xl overflow-hidden shadow-lg cursor-pointer border-2 border-transparent hover:border-blue-500">
      {stroy.mediaIds[0].mediaType === "image" ? (
        <Image
          src={stroy.mediaIds[0].mediaUrl}
          alt="Story"
          width={200}
          height={250}
          className="object-cover w-full h-full rounded-xl"
        />
      ) : (
        <video src={stroy.mediaIds[0].mediaUrl} className="object-cover w-full h-full rounded-xl" />
      )}
      <div className="absolute bottom-2 left-2 flex items-center">
        <Image
          src={stroy?.userId?.profileImage || ""}
          alt={"Author"}
          width={32}
          height={32}
          className="rounded-full mr-2"
        />
        <span className="text-white text-sm font-semibold">{stroy?.userId?.fullName}</span>
      </div>
    </div>
  );
};

export default StoryCard;
