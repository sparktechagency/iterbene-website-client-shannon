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
import ReportModal, { ReportType } from "@/components/custom/ReportModal";
import toast from "react-hot-toast";
import { TError } from "@/types/error";
import formatTimeAgo from "@/utils/formatTimeAgo";
import Link from "next/link";
import {
  useIsPostSavedQuery,
  useSavePostMutation,
  useUnsavePostMutation, // Import unsave mutation
} from "@/redux/features/savedPost/savedPost.api";
import { openAuthModal } from "@/redux/features/auth/authModalSlice";
import { useAppDispatch } from "@/redux/hooks";

interface PostHeaderProps {
  post: IPost;
  onEditClick?: () => void;
  refetch?: () => void;
}

const PostHeader = ({ post, onEditClick, refetch }: PostHeaderProps) => {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isOwnPost = post?.userId?._id === user?._id;
  //dispatch openAuthModal
  const dispatch = useAppDispatch();

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Delete post
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  // Check if post is saved
  const { data: isSaved, isLoading: isCheckingSaved } = useIsPostSavedQuery(
    post?._id,
    { skip: !post?._id }
  );

  // Save post
  const [savePost, { isLoading: isSaving }] = useSavePostMutation();

  // Unsave post
  const [unsavePost, { isLoading: isUnsaving }] = useUnsavePostMutation();

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle edit
  const handleEdit = () => {
    setIsOpen(false);
    onEditClick?.();
  };

  // Handle delete
  const handleDelete = () => {
    setIsOpen(false);
    setIsDeletePopupOpen(true);
  };

  // Handle save
  const handleSave = async () => {
    if (!user) {
      dispatch(openAuthModal());
      setIsOpen(false);
      return;
    }
    try {
      const payload = { postId: post._id };
      await savePost(payload).unwrap();
      toast.success("Post saved successfully!");
      setIsOpen(false);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Failed to save post");
    }
  };

  // Handle unsave
  const handleUnsave = async () => {
    try {
      await unsavePost(post?._id).unwrap();
      toast.success("Post unsaved successfully!");
      setIsOpen(false);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Failed to unsave post");
    }
  };

  // Handle report
  const handleReport = () => {
    if (!user) {
      dispatch(openAuthModal());
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    setIsReportModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      await deletePost(post._id).unwrap();
      setIsDeletePopupOpen(false);
      refetch?.();
      toast.success("Post deleted successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Failed to delete post");
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
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };
  return (
    <section className="w-full flex justify-between items-center gap-4">
      <div className="flex items-center mb-3">
        <Image
          src={post?.userId?.profileImage || "/default-profile.png"} // Fallback image
          alt={post?.userId?.fullName || "User"}
          width={50}
          height={50}
          className="size-[50px] object-cover rounded-full mr-3 ring-2 ring-gray-200"
        />
        <div>
          <div className="flex items-center gap-2">
            <Link href={`/${post?.userId?.username || ""}`}>
              <p className="font-medium text-gray-800 text-lg">
                {post?.userId?.fullName || "Unknown User"}
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
                <span>{post.visitedLocationName}</span>
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
          aria-label="More options"
          aria-expanded={isOpen}
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
              {/* Save/Unsave Option */}
              <button
                onClick={isSaved ? handleUnsave : handleSave}
                disabled={isSaving || isUnsaving || isCheckingSaved}
                className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer rounded-t-xl disabled:opacity-50"
                aria-label={isSaved ? "Unsave post" : "Save post"}
              >
                {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                <span>{isSaved ? "Unsave Post" : "Save Post"}</span>
              </button>

              {/* Own Post Options */}
              {isOwnPost && (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 border-t border-gray-100 transition-colors cursor-pointer"
                    aria-label="Edit post"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-rose-500 hover:bg-gray-100 transition-colors border-t border-gray-100 rounded-b-xl cursor-pointer"
                    aria-label="Delete post"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </>
              )}

              {/* Report Option */}
              {!isOwnPost && (
                <button
                  onClick={handleReport}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 transition-colors border-t border-gray-100 rounded-b-xl cursor-pointer"
                  aria-label="Report post"
                >
                  <Flag size={16} />
                  Report Post
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
        reportedUserId={post?.userId?._id || ""}
        reportedEntityId={post._id}
      />
    </section>
  );
};

export default PostHeader;
