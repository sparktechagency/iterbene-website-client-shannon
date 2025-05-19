"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { HiGlobe } from "react-icons/hi";
import { TiLocation } from "react-icons/ti";
import { BsThreeDots } from "react-icons/bs";
import { IPost } from "@/types/post.types";
import { Lock, Users } from "lucide-react";
import moment from "moment";

const PostHeader = ({
  post,
  isOwnPost = false,
}: {
  post: IPost;
  isOwnPost?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleEdit = () => {
    console.log("Edit post:", post?._id);
    setIsOpen(false);
  };

  const handleDelete = () => {
    console.log("Delete post:", post?._id);
    setIsOpen(false);
  };

  const handleSave = () => {
    console.log("Save post:", post?._id);
    setIsOpen(false);
  };

  const handleHide = () => {
    console.log("Hide post:", post?._id);
    setIsOpen(false);
  };

  const handleReport = () => {
    console.log("Report post:", post?._id);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatTimeAgo = (createdAt: string | Date) => {
    if (!createdAt) return "";
    const now = moment();
    const postTime = moment(
      typeof createdAt === "string" ? createdAt : createdAt.toISOString()
    );
    const diffSeconds = now.diff(postTime, "seconds");
    const diffMinutes = now.diff(postTime, "minutes");
    const diffHours = now.diff(postTime, "hours");
    const diffDays = now.diff(postTime, "days");

    if (diffSeconds < 60) {
      return diffSeconds === 1 ? "1 sec ago" : `${diffSeconds} secs ago`;
    } else if (diffMinutes < 60) {
      return diffMinutes === 1 ? "1 min ago" : `${diffMinutes} mins ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? "1 hr ago" : `${diffHours} hrs ago`;
    } else if (diffDays < 7) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    } else {
      return postTime.format("MMM D, YYYY"); // Fallback to date format for older posts
    }
  };
  return (
    <section className="w-full flex justify-between items-center gap-4">
      <div className="flex items-center mb-3">
        <Image
          src={post?.userId?.profileImage}
          alt={post?.userId?.fullName}
          width={60}
          height={60}
          className="size-[60px] object-cover rounded-full mr-3 ring-2 ring-gray-200"
        />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-gray-800 text-lg">
              {post?.userId?.fullName}
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

      <div className="relative">
        <button
          ref={triggerRef}
          onClick={toggleDropdown}
          className="cursor-pointer"
        >
          <BsThreeDots size={28} />
        </button>
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-1 w-48 bg-white rounded-md border py-1 z-50"
          >
            {isOwnPost ? (
              <>
                <button
                  onClick={handleEdit}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Save
                </button>
                <button
                  onClick={handleHide}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Hide
                </button>
                <button
                  onClick={handleReport}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Report
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PostHeader;
