import { IPost } from "@/types/post.types";
import { getFullName } from "@/utils/nameUtils";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { Lock, Users } from "lucide-react";
import Image from "next/image";
import React from "react";
import { FaXmark } from "react-icons/fa6";
import { HiGlobe } from "react-icons/hi";
import { TiLocation } from "react-icons/ti";

const PostDetailsHeader = ({
  post,
  onClose,
}: {
  post: IPost;
  onClose: () => void;
}) => {
  return (
    <section className="w-full flex justify-between gap-4 px-2 py-2">
      <div className="flex items-center mb-3">
        <Image
          src={post?.userId?.profileImage}
          alt={getFullName(post?.userId) || "User"}
          width={50}
          height={50}
          className="size-[50px] object-cover rounded-full mr-3 ring-2 ring-gray-200"
        />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-800 text-lg">
              {getFullName(post?.userId)}
            </p>
            <span className="text-sm">
              {post?.createdAt && formatTimeAgo(post?.createdAt)}
            </span>
          </div>
          <div className="text-sm text-gray-900 flex items-center gap-2 -ml-1 mt-1">
            {post?.visitedLocationName && (
              <>
                <TiLocation size={28} className="text-primary" />
                <span className="flex items-center">
                  {post?.visitedLocationName}
                </span>
              </>
            )}
            {post?.privacy === "public" ? (
              <HiGlobe size={25} className="text-primary" />
            ) : post?.privacy === "friends" ? (
              <Users size={28} className="text-primary" />
            ) : (
              <Lock size={28} className="text-primary" />
            )}
          </div>
        </div>
      </div>
      <div onClick={onClose} className="flex gap-2 cursor-pointer">
        <FaXmark size={25} className="text-gray-600"  />
      </div>
    </section>
  );
};

export default PostDetailsHeader;
