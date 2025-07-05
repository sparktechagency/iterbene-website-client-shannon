import CustomModal from "@/components/custom/custom-modal";
import { useRemoveGroupMutation } from "@/redux/features/group/groupApi";
import { TError } from "@/types/error";
import { IGroup } from "@/types/group.types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";
import { PiUserBold } from "react-icons/pi";

// Define the TypeScript interface for the card prop
const JoinedGroupCard = ({ group }: { group: IGroup }) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  // Remove Group
  const [removeGroup, { isLoading: isRemoveLoading }] =
    useRemoveGroupMutation();
  // Handle Remove Group with Confirmation
  const handleRemoveGroup = async () => {
    try {
      await removeGroup(group?._id).unwrap();
      toast.success("Successfully removed the group!");
      router.push("/groups");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  return (
    <>
      <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
        {/* Group Image */}
        <div className="w-full h-56 md:h-60 lg:h-[248px]  bg-gray-200 rounded-xl mb-4 relative">
          <Image
            src={group?.groupImage}
            alt={group?.name}
            width={248}
            height={248}
            className="w-full h-56 md:h-60 lg:h-[248px] object-cover rounded-2xl mb-4"
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-950/20 rounded-xl"></div>
          {/* Member Count Overlay */}
          <div className="absolute top-5 right-5 bg-white rounded-full px-4 py-2 flex items-center gap-1">
            <PiUserBold size={20} className="text-secondary" />
            <span className="text-sm font-semibold text-gray-800">
              {group?.participantCount}
            </span>
          </div>
          {/* Group Name */}
          <h2 className="text-xl md:text-2xl font-bold text-white absolute bottom-4 left-2">
            {group?.name}
          </h2>
        </div>
        {/* Buttons */}
        <div className="flex flex-col gap-5 w-full">
          <Link className="w-full block" href={`/groups/${group?._id}`}>
            <button className="w-full bg-secondary  text-white  px-5 py-3 rounded-xl border border-secondary cursor-pointer">
              View
            </button>
          </Link>
          <button
            onClick={openDeleteModal}
            className="border border-[#9EA1B3] text-gray-900 px-5 py-3   rounded-xl cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
      {/* Delete Group Confirmation Modal */}
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        maxWidth="max-w-md"
        header={
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
            <h2 className="text-xl font-semibold text-gray-800">
              Confirm Delete Group
            </h2>
            <button
              className="text-gray-600 hover:text-gray-800 text-2xl cursor-pointer"
              onClick={closeDeleteModal}
            >
              <IoCloseSharp size={18} />
            </button>
          </div>
        }
           className="w-full p-2"
      >
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-lg">
            Are you sure you want to delete this group? This action will
            permanently remove the group and all its content for all members.
            This cannot be undone.
          </p>
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={closeDeleteModal}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleRemoveGroup();
                closeDeleteModal();
              }}
              disabled={isRemoveLoading}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                isRemoveLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-secondary text-white"
              }`}
            >
              {isRemoveLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default JoinedGroupCard;
