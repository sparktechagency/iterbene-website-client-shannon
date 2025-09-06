import ConfirmationPopup from "@/components/custom/custom-popup";
import {
  useLeaveGroupMutation,
} from "@/redux/features/group/groupApi";
import { TError } from "@/types/error";
import { IGroup } from "@/types/group.types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { PiUserBold } from "react-icons/pi";
import { Eye, LogOut } from "lucide-react";

// Define the TypeScript interface for the card prop
const JoinedGroupCard = ({
  group,
  handleOptimisticUpdateUi,
}: {
  group: IGroup;
  handleOptimisticUpdateUi?: (groupId: string) => void;
}) => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const router = useRouter();
  // Leave Group
  const [leaveGroup, { isLoading: isLeaveLoading }] = useLeaveGroupMutation();
  // Leave Group
  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(group?._id).unwrap();
      toast.success("Successfully left the group!");
      if (handleOptimisticUpdateUi) {
        handleOptimisticUpdateUi(group?._id);
      }
      router.push("/groups");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const openLeaveModal = () => {
    setIsLeaveModalOpen(true);
  };

  const closeLeaveModal = () => {
    setIsLeaveModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Group Image */}
        <div className="relative w-full h-48 sm:h-52 md:h-56 overflow-hidden">
          <Image
            src={group?.groupImage}
            alt={group?.name}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Member Count Badge */}
          <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5">
            <PiUserBold size={14} className="text-secondary" />
            <span className="text-xs font-semibold text-gray-800">
              {group?.participantCount}
            </span>
          </div>
          {/* Group Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white truncate mb-1">
              {group?.name}
            </h3>
            <p className="text-white/80 text-sm line-clamp-2">
              {group?.description || "You are a member of this group"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          <Link href={`/groups/${group?._id}`} className="w-full block">
            <button className="w-full bg-secondary cursor-pointer hover:bg-secondary/90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Eye size={16} />
              View Group
            </button>
          </Link>
          
          <button
            disabled={isLeaveLoading}
            onClick={openLeaveModal}
            className="w-full border border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            {isLeaveLoading ? "Leaving..." : "Leave Group"}
          </button>
        </div>
      </div>
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
    </>
  );
};

export default JoinedGroupCard;
