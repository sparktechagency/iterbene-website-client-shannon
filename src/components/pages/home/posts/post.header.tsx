"use client";
import { useState, useRef, useEffect } from "react";
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
import ConfirmationPopup from "@/components/custom/custom-popup";
import ReportModal, { ReportType } from "@/components/custom/ReportModal";
import toast from "react-hot-toast";
import { TError } from "@/types/error";
import { getFullName } from "@/utils/nameUtils";
import formatTimeAgo from "@/utils/formatTimeAgo";
import Link from "next/link";
import { openAuthModal } from "@/redux/features/auth/authModalSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useDeletePostMutation } from "@/redux/features/post/postApi";
import {
  useIsPostSavedQuery,
  useSavePostMutation,
  useUnsavePostMutation,
} from "@/redux/features/savedPost/savedPost.api";

interface PostHeaderProps {
  post: IPost;
  onEditClick?: () => void;
  setAllPosts?: (posts: IPost[] | ((prev: IPost[]) => IPost[])) => void;
}

const PostHeader = ({ post, onEditClick, setAllPosts }: PostHeaderProps) => {
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isOwnPost = post?.userId?._id === user?._id;
  const dispatch = useAppDispatch();

  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const { data: isSaved, isLoading: isCheckingSaved } = useIsPostSavedQuery(
    post?._id,
    { skip: !post?._id || !user?._id }
  );
  const [savePost, { isLoading: isSaving }] = useSavePostMutation();
  const [unsavePost, { isLoading: isUnsaving }] = useUnsavePostMutation();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleEdit = () => {
    setIsOpen(false);
    onEditClick?.();
  };

  const handleDelete = () => {
    setIsOpen(false);
    setIsDeletePopupOpen(true);
  };

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

  const handleReport = () => {
    if (!user) {
      dispatch(openAuthModal());
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    setIsReportModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePost(post._id).unwrap();
      toast.success("Post deleted successfully!");
      if (setAllPosts) {
        setAllPosts((prevPosts: IPost[]) =>
          prevPosts.filter((p) => p._id !== post._id)
        );
      }
      setIsDeletePopupOpen(false);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Failed to delete post");
      // Revert optimistic update
      if (setAllPosts) {
        setAllPosts((prevPosts: IPost[]) => [...prevPosts, post]);
      }
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
      transition: { duration: 0.2, ease: "easeOut" as const },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" as const },
    },
  };

  return (
    <section className="w-full flex justify-between items-center gap-4">
      <div className="w-full flex items-center mb-3">
        <Image
          src={post?.userId?.profileImage || "/default-profile.png"}
          alt={getFullName(post?.userId) || "User"}
          width={50}
          height={50}
          className="size-[50px] object-cover rounded-full mr-3 ring-2 ring-gray-200"
        />
        <div className="w-full">
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href={`/${post?.userId?.username || ""}`}
                className="hover:underline"
              >
                <p className="font-medium text-gray-800 text-sm md:text-lg">
                  {getFullName(post?.userId) || "Unknown User"}
                </p>
              </Link>
            ) : (
              <p className="font-medium text-gray-800 text-lg">
                {getFullName(post?.userId) || "Unknown User"}
              </p>
            )}
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
              <HiGlobe
                size={23}
                className="size-[19px] md:size-[20px] text-primary"
              />
            ) : post?.privacy === "friends" ? (
              <HiUsers
                size={23}
                className="size-[19px] md:size-[20px]  text-primary"
              />
            ) : (
              <HiLockClosed
                size={23}
                className="size-[19px] md:size-[20px] ] text-primary"
              />
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
              <button
                onClick={isSaved ? handleUnsave : handleSave}
                disabled={isSaving || isUnsaving || isCheckingSaved}
                className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer rounded-t-xl disabled:opacity-50"
                aria-label={isSaved ? "Unsave post" : "Save post"}
              >
                {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                <span>{isSaved ? "Unsave Post" : "Save Post"}</span>
              </button>

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
