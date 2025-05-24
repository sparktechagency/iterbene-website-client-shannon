import { IGroupDetails } from "@/types/group.types";
import { Globe, Lock } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import GroupInviteModal from "./GroupInviteModal";
import {
  useLeaveGroupMutation,
  useRemoveGroupMutation,
} from "@/redux/features/group/groupApi";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import { TError } from "@/types/error";
import { useRouter } from "next/navigation";
import CustomModal from "@/components/custom/custom-modal";
import { IoCloseSharp } from "react-icons/io5";

const GroupDetailsHeader = ({
  groupDetailsData,
}: {
  groupDetailsData: IGroupDetails;
}) => {
  const user = useUser();
  const owner = groupDetailsData?.creatorId?._id === user?._id;
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const router = useRouter();
  // Remove Group
  const [removeGroup, { isLoading: isRemoveLoading }] =
    useRemoveGroupMutation();
  // Leave Group
  const [leaveGroup, { isLoading: isLeaveLoading }] = useLeaveGroupMutation();

  // Handle Leave Group with Confirmation
  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(groupDetailsData?._id).unwrap();
      toast.success("Successfully left the group!");
      router.push("/groups");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Handle Remove Group with Confirmation
  const handleRemoveGroup = async () => {
    try {
      await removeGroup(groupDetailsData?._id).unwrap();
      toast.success("Successfully removed the group!");
      router.push("/groups");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  const openLeaveModal = () => {
    setIsLeaveModalOpen(true);
  };

  const closeLeaveModal = () => {
    setIsLeaveModalOpen(false);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="w-full bg-white rounded-xl relative">
        {groupDetailsData?.groupImage && (
          <Image
            src={groupDetailsData?.groupImage}
            alt="background"
            width={1600}
            height={360}
            className="w-full h-[200px] sm:h-[280px] md:h-[360px] object-cover rounded-t-2xl"
          />
        )}

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 px-[24px] md:px-[40px] py-[24px] md:py-[36px]">
          <div className="space-y-2">
            <h1 className="text-center md:text-left text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold text-gray-800">
              {groupDetailsData?.name}
            </h1>
            <div className="flex flex-wrap gap-2 sm:gap-3 text-gray-600 text-sm sm:text-lg items-center">
              {groupDetailsData?.privacy === "public" ? (
                <Globe className="text-primary" size={20} />
              ) : (
                <Lock className="text-primary" size={20} />
              )}
              <p className="text-gray-600">
                {groupDetailsData?.privacy === "public" ? "Public" : "Private"}{" "}
                group
              </p>
              <div className="size-2 bg-primary rounded-full"></div>
              <p className="text-gray-600">
                {groupDetailsData?.participantCount} members
              </p>
            </div>
          </div>
          <div className="flex gap-5">
            <button
              onClick={openInviteModal}
              className="text-primary cursor-pointer bg-[#E9F8F9] border border-primary font-medium px-10 py-3 rounded-xl hover:bg-primary hover:text-white transition-colors"
            >
              Invite
            </button>
            {owner ? (
              <button
                disabled={isRemoveLoading}
                onClick={openDeleteModal} // Open delete confirmation modal
                className="text-black cursor-pointer bg-transparent border border-[#9194A9] font-medium px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {isRemoveLoading ? "Removing..." : "Remove"}
              </button>
            ) : (
              <button
                disabled={isLeaveLoading}
                onClick={openLeaveModal} // Open leave confirmation modal
                className="text-black cursor-pointer bg-transparent border border-[#9194A9] font-medium px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {isLeaveLoading ? "Leaving..." : "Leave"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <GroupInviteModal
        groupDetailsData={groupDetailsData}
        isInviteModalOpen={isInviteModalOpen}
        setIsInviteModalOpen={setIsInviteModalOpen}
        closeInviteModal={closeInviteModal}
      />

      {/* Leave Group Confirmation Modal */}
      <CustomModal
        isOpen={isLeaveModalOpen}
        onClose={closeLeaveModal}
        maxWidth="max-w-md"
        header={
          <div className="flex items-center justify-between  px-4 py-3 border-b border-gray-200 rounded-t-xl">
            <h2 className="text-xl font-semibold text-gray-800">
              Confirm Leave Group
            </h2>
            <button
              className="text-gray-600 hover:text-gray-800 text-2xl cursor-pointer"
              onClick={closeLeaveModal}
            >
              <IoCloseSharp size={18} />
            </button>
          </div>
        }
      >
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-lg">
            Are you sure you want to leave this group? You will no longer have
            access to its content.
          </p>
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={closeLeaveModal}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleLeaveGroup();
                closeLeaveModal();
              }}
              disabled={isLeaveLoading}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                isLeaveLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {isLeaveLoading ? "Leaving..." : "Leave"}
            </button>
          </div>
        </div>
      </CustomModal>

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
                  : "bg-red-500 text-white hover:bg-red-600"
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

export default GroupDetailsHeader;
