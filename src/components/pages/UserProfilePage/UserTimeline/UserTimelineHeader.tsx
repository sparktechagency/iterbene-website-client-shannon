"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { HiGlobe } from "react-icons/hi";
import { TiLocation } from "react-icons/ti";
import { BsThreeDots } from "react-icons/bs";
import { IPost } from "@/types/post.types";

const UserTimelineHeader = ({
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
    console.log("Edit post:", post.id);
    setIsOpen(false);
  };

  const handleDelete = () => {
    console.log("Delete post:", post.id);
    setIsOpen(false);
  };

  const handleSave = () => {
    console.log("Save post:", post.id);
    setIsOpen(false);
  };

  const handleHide = () => {
    console.log("Hide post:", post.id);
    setIsOpen(false);
  };

  const handleReport = () => {
    console.log("Report post:", post.id);
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

export default UserTimelineHeader;
