"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { HiGlobe, HiLockClosed, HiUsers } from "react-icons/hi";
import { TiLocation } from "react-icons/ti";
import { IPost } from "@/types/post.types";
import {
  MoreHorizontal,
  Bookmark,
  Flag,
  BookmarkCheck,
  Pencil,
  Trash2,
} from "lucide-react";
import useUser from "@/hooks/useUser";
import { motion, AnimatePresence } from "framer-motion";
import { useDeletePostMutation } from "@/redux/features/post/postApi";
import ConfirmationPopup from "@/components/custom/custom-popup";
import ReportModal, { ReportType } from "@/components/custom/ReportModal"; // Adjust path as needed
import toast from "react-hot-toast";
import { TError } from "@/types/error";
import formatTimeAgo from "@/utils/formatTimeAgo";
import Link from "next/link";

interface PostHeaderProps {
  post: IPost;
  onRemove?: () => void;
  onEditClick?: () => void;
  isSaved?: boolean; // To track if post is saved
  onSaveToggle?: (postId: string, isSaved: boolean) => void; // Callback for save/unsave
}

const PostHeader = ({
  post,
  onRemove,
  onEditClick,
  isSaved = false,
  onSaveToggle,
}: PostHeaderProps) => {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isOwnPost = post?.userId?._id == user?._id;

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleEdit = () => {
    setIsOpen(false);
    onEditClick?.();
  };

  const handleDelete = () => {
    setIsOpen(false);
    setIsDeletePopupOpen(true);
  };

  const handleSaveToggle = () => {
    setIsOpen(false);
    onSaveToggle?.(post._id, !isSaved);
  };

  const handleReport = () => {
    setIsOpen(false);
    setIsReportModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePost(post._id).unwrap();
      setIsDeletePopupOpen(false);
      toast.success("Post deleted successfully!");
      onRemove?.();
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
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
              {/* Save/Unsave Option - Available for all posts */}
              <button
                onClick={handleSaveToggle}
                className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer rounded-t-xl"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck size={16} className="text-blue-600" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={16} />
                    <span>Save Post</span>
                  </>
                )}
              </button>

              {/* Own Post Options */}
              {isOwnPost && (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full gap-3  text-left px-4 py-3 text-gray-800 hover:bg-gray-100 border-t border-gray-100 transition-colors cursor-pointer"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full gap-3  text-left px-4 py-3 text-rose-500 hover:bg-gray-100 transition-colors border-t border-gray-100 rounded-b-xl cursor-pointer"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </>
              )}

              {/* Report Option - Available for other users' posts */}
              {!isOwnPost && (
                <button
                  onClick={handleReport}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 transition-colors border-t rounded-b-xl cursor-pointer border-gray-100"
                >
                  <Flag size={16} />
                  <span>Report Post</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Popup */}
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

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportType={ReportType.POST}
        reportedUserId={post?.userId?._id}
        reportedEntityId={post._id}
      />
    </section>
  );
};

export default PostHeader;
