import { IPost } from "@/types/post.types";
import Link from "next/link";
import React from "react";
import { FaCalendarCheck, FaHeart } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import MyProfileTimelineContentRender from "./MyProfileTimelineContentRender";
import MyProfileTimelineHeader from "./MyProfileTimelineHeader";
interface MyProfileTimeLineCardProps {
  post: IPost;
}

const MyProfileTimeLineCard: React.FC<MyProfileTimeLineCardProps> = ({ post }) => {
  const sortedReactions = Object.entries(post?.reactions)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <Link href={`/feed/${post?.id}`}>
      <div className="w-full bg-white rounded-xl p-4 mb-4">
        <MyProfileTimelineHeader post={post} />
        <p className="text-gray-700 mb-4">{post.content.text}</p>
        <MyProfileTimelineContentRender data={post.content.media || []} />
        <div className="flex gap-7 items-center mt-5 border-b border-[#9194A9] pt-8 pb-5">
          <div className="relative flex items-center">
            <button className="text-gray-600 flex gap-2 items-center cursor-pointer">
              <FaHeart className="size-6 text-primary" />
              {sortedReactions.length > 0
                ? sortedReactions[0][0].charAt(0).toUpperCase() +
                sortedReactions[0][0].slice(1)
                : ""}
            </button>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <RiMessage2Fill className="size-6 text-primary" />
            <span className="font-semibold">{post?.comments?.length}</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <FaCalendarCheck className="h-5 w-5 text-primary" />
            <span className="font-semibold">{post.shares}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MyProfileTimeLineCard;
