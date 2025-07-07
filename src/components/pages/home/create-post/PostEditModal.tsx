"use client";
import CustomModal from "@/components/custom/custom-modal";
import { IPost } from "@/types/post.types";
import { IoMdClose } from "react-icons/io";
import CreatePost from "./create-post";

interface PostEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: IPost;
  onPostUpdated: () => void;
}

const PostEditModal: React.FC<PostEditModalProps> = ({
  isOpen,
  onClose,
  post,
  onPostUpdated,
}) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      header={
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800">Edit Post</h2>
          <button
            className="text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
            onClick={onClose}
          >
            <IoMdClose size={18} />
          </button>
        </div>
      }
      className="w-full p-0"
    >
      <CreatePost initialPostData={post} onPostCreated={onPostUpdated} />
    </CustomModal>
  );
};

export default PostEditModal;
