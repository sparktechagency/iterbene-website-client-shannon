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
import ConfirmationPopup from "@/components/custom/custom-popup";

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
                onClick={openDeleteModal}
                className="text-black cursor-pointer bg-transparent border border-[#9194A9] font-medium px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {isRemoveLoading ? "Removing..." : "Remove"}
              </button>
            ) : (
              <button
                disabled={isLeaveLoading}
                onClick={openLeaveModal}
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
      <ConfirmationPopup
        isOpen={isLeaveModalOpen}
        onClose={closeLeaveModal}
        onConfirm={handleLeaveGroup}
        type="warning"
        title="Leave Group"
        message="Are you sure you want to leave this group? This action cannot be undone."
        confirmText="Leave"
        cancelText="Cancel"
        isLoading={isLeaveLoading}
      />

      {/* Delete Group Confirmation Modal */}
      <ConfirmationPopup
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleRemoveGroup}
        type="warning"
        title="Delete Group"
        message="Are you sure you want to delete this group? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isRemoveLoading}
      />
    </>
  );
};

export default GroupDetailsHeader;