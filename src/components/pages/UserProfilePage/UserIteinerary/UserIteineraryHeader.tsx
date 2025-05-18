"use client";
import Image from "next/image";
import { HiGlobe } from "react-icons/hi";
import { TiLocation } from "react-icons/ti";
import { IPost } from "@/types/post.types";

const UserItineraryHeader = ({
  post
}: {
  post: IPost;
  isOwnPost?: boolean;
}) => {

  return (
    <section className="w-full flex justify-between items-center gap-4">
      <div className="flex items-center mb-3">
        <Image
          src={post.profilePic}
          alt={post.username}
          width={60}
          height={60}
          className="size-[60px] object-cover rounded-full mr-3 ring-2 ring-gray-200"
        />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-gray-800 text-lg">{post.username}</p>
            <span className="text-sm">{post.timestamp}</span>
          </div>
          <div className="text-sm text-gray-900 flex items-center gap-2 mt-1">
            {post.location && (
              <>
                <TiLocation size={28} className="text-primary" />
                <span className="flex items-center">{post.location}</span>
              </>
            )}
            <HiGlobe size={28} className="text-primary" />
          </div>
        </div>
      </div>

    </section>
  );
};

export default UserItineraryHeader;
