"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { HiGlobe, HiLockClosed, HiUsers } from "react-icons/hi";
import { TiLocation } from "react-icons/ti";
import { IPost } from "@/types/post.types";
import {MoreHorizontal } from "lucide-react";
import useUser from "@/hooks/useUser";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { useDeletePostMutation } from "@/redux/features/post/postApi";
import ConfirmationPopup from "@/components/custom/custom-popup";
import toast from "react-hot-toast";
import { TError } from "@/types/error";
import formatTimeAgo from "@/utils/formatTimeAgo";
import Link from "next/link";

const PostHeader = ({
  post,
  onRemove,
}: {
  post: IPost;
  onRemove?: () => void;
}) => {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isOwnPost = post?.userId?._id == user?._id;

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleEdit = () => {
    console.log("Edit post:", post?._id);
    setIsOpen(false);
  };

  const handleDelete = () => {
    setIsOpen(false);
    setIsDeletePopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePost(post._id).unwrap();
      setIsDeletePopupOpen(false);
      toast.success("Post deleted successfully!");
      // Call onRemove to update UI immediately
      onRemove?.();
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // const handleSave = () => {
  //   console.log("Save post:", post?._id);
  //   setIsOpen(false);
  // };

  // const handleReport = () => {
  //   console.log("Report post:", post?._id);
  //   setIsOpen(false);
  // };

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
  // Define animation variants for the dropdown
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };
  return (
    <section className="w-full flex justify-between items-center gap-4">
      <div className="flex items-center mb-3">
        <Image
          src={post?.userId?.profileImage}
          alt={post?.userId?.fullName}
          width={50}
          height={50}
          className="size-[50px] object-cover rounded-full mr-3 ring-2 ring-gray-200"
        />
        <div>
          <div className="flex items-center gap-2">
            <Link href={`/${post?.userId?.username}`}>
              <p className="font-medium text-gray-800 text-lg hover:underline">
                {post?.userId?.fullName}
              </p>
            </Link>
            <span className="text-sm">
              {post?.createdAt && formatTimeAgo(post?.createdAt)}
            </span>
          </div>
          <div className="text-sm text-gray-900 flex items-center gap-2 -ml-1 mt-1">
            {post?.visitedLocationName && (
              <>
                <TiLocation size={23} className="text-primary" />
                <span className="flex items-center">
                  {post?.visitedLocationName}
                </span>
              </>
            )}
            {post?.privacy === "public" ? (
              <HiGlobe size={23} className="text-primary" />
            ) : post?.privacy === "friends" ? (
              <HiUsers size={23} className="text-primary" />
            ) : (
              <HiLockClosed size={23} className="text-primary" />
            )}
          </div>
        </div>
      </div>

      {isOwnPost && (
        <div className="relative">
          <button
            ref={triggerRef}
            onClick={toggleDropdown}
            className="cursor-pointer p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreHorizontal size={23} />
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={dropdownRef}
                className="absolute right-0 mt-1 w-48 bg-white rounded-xl border border-gray-50 shadow-md z-50"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* {isOwnPost ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-t-xl cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-3 text-rose-500 hover:bg-gray-100 rounded-b-xl cursor-pointer"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                   className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-t-xl cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleReport}
                    className="block w-full text-left px-4 py-3 text-rose-500 hover:bg-gray-100"
                  >
                    Report
                  </button>
                </>
              )} */}
                {isOwnPost && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-t-xl cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="block w-full text-left px-4 py-3 text-rose-500 hover:bg-gray-100 rounded-b-xl cursor-pointer"
                    >
                      Delete
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <ConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={handleConfirmDelete}
        type="delete"
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </section>
  );
};

export default PostHeader;
