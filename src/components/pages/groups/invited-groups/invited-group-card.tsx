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
import { Check, X, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleAcceptInvite = async () => {
    try {
      await acceptInvite({ inviteId: group?._id }).unwrap();
      if (handleOptimisticUpdateUi) {
        handleOptimisticUpdateUi(group?._id);
      }
      toast.success("Successfully accepted the group!");
      router.push(`/groups/${group?._id}`);
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
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Group Image */}
      <div className="relative w-full h-48 sm:h-52 md:h-56 overflow-hidden">
        {group?.groupId?.groupImage && (
          <Image
            src={group?.groupId?.groupImage}
            alt={group?.groupId?.name}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Member Count Badge */}
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <PiUserBold size={14} className="text-secondary" />
          <span className="text-xs font-semibold text-gray-800">
            {group?.groupId?.participantCount}
          </span>
        </div>

        {/* Invitation Badge */}
        <div className="absolute top-3 left-3 bg-secondary text-white rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <Mail size={12} />
          <span className="text-xs font-medium">Invited</span>
        </div>

        {/* Group Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white truncate mb-1">
            {group?.groupId?.name}
          </h3>
          <p className="text-white/80 text-sm line-clamp-2">
            {group?.groupId?.description ||
              "You've been invited to join this group"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <button
          disabled={isAcceptInviteLoading}
          onClick={handleAcceptInvite}
          className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Check size={16} />
          {isAcceptInviteLoading ? "Accepting..." : "Accept Invitation"}
        </button>

        <button
          disabled={isDeclineInviteLoading}
          onClick={handleDeclineInvite}
          className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <X size={16} />
          {isDeclineInviteLoading ? "Declining..." : "Decline"}
        </button>
      </div>
    </div>
  );
};

export default InvitedGroupCard;
