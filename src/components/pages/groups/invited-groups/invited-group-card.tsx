import {
  useAcceptGroupInviteMutation,
  useDeclineGroupInviteMutation,
} from "@/redux/features/group/groupApi";
import { TError } from "@/types/error";
import { IGroupInvite } from "@/types/group.types";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import { PiUserBold } from "react-icons/pi";
const InvitedGroupCard = ({
  group,
  handleOptimisticUpdateUi,
}: {
  group: IGroupInvite;
  handleOptimisticUpdateUi?: (groupId: string) => void;
}) => {
  const [acceptInvite, { isLoading: isAcceptInviteLoading }] =
    useAcceptGroupInviteMutation();
  const [declineInvite, { isLoading: isDeclineInviteLoading }] =
    useDeclineGroupInviteMutation();

  const handleAcceptInvite = async () => {
    try {
      await acceptInvite({ inviteId: group?._id }).unwrap();
      if (handleOptimisticUpdateUi) {
        handleOptimisticUpdateUi(group?._id);
      }
      toast.success("Successfully accepted the group!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  const handleDeclineInvite = async () => {
    try {
      await declineInvite({ inviteId: group?._id }).unwrap();
      if (handleOptimisticUpdateUi) {
        handleOptimisticUpdateUi(group?._id);
      }
      toast.success("Successfully declined the group!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
      {/* Group Image */}
      <div className="w-full h-56 md:h-60 lg:h-[248px]  bg-gray-200 rounded-xl mb-4 relative">
        <Image
          src={group?.groupId?.groupImage}
          alt={group?.groupId?.name}
          width={248}
          height={248}
          className="w-full h-56 md:h-60 lg:h-[248px] object-cover rounded-2xl mb-4"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-950/20 rounded-xl"></div>
        {/* Member Count Overlay */}
        <div className="absolute top-5 right-5 bg-white rounded-full px-4 py-2 flex items-center gap-1">
          <PiUserBold size={20} className="text-secondary" />
          <span className="text-sm font-semibold text-gray-800">
            {group?.groupId?.participantCount}
          </span>
        </div>
        {/* Group Name */}
        <h2 className="text-xl md:text-2xl font-bold text-white absolute bottom-4 left-2">
          {group?.groupId?.name}
        </h2>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button
          disabled={isAcceptInviteLoading}
          onClick={handleAcceptInvite}
          className="bg-secondary hover:bg-[#FEEFE8] hover:text-secondary text-white  px-5 py-3.5 rounded-xl border border-secondary transition cursor-pointer"
        >
          {isAcceptInviteLoading ? "Accepting..." : "Accept"}
        </button>
        <button
          disabled={isDeclineInviteLoading}
          onClick={handleDeclineInvite}
          className="border border-[#9EA1B3] text-gray-900 px-5 py-3.5   rounded-xl hover:bg-gray-100 transition cursor-pointer"
        >
          {isDeclineInviteLoading ? "Declining..." : "Decline"}
        </button>
      </div>
    </div>
  );
};

export default InvitedGroupCard;
