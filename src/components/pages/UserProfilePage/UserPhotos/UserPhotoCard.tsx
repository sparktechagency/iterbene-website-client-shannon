import { IMedia } from "@/types/post.types";
import Image from "next/image";
import React from "react";

interface UserPhotoCardProps {
  media: IMedia;
  index: number;
  handleImageClick: (index: number) => void;
}
const UserPhotoCard = ({
  media,
  index,
  handleImageClick,
}: UserPhotoCardProps) => {
  return (
    <div
      key={media._id}
      className="w-full h-56 md:h-80 relative cursor-pointer"
      onClick={() => handleImageClick(index)}
    >
      <Image
        src={media?.mediaUrl}
        alt={media?._id}
        fill
        className="object-cover rounded-xl"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 25vw, 25vw"
        priority={index < 4}
      />
    </div>
  );
};

export default UserPhotoCard;
