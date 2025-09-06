import ConfirmationPopup from "@/components/custom/custom-popup";
import { useRemoveGroupMutation } from "@/redux/features/group/groupApi";
import { TError } from "@/types/error";
import { IGroup } from "@/types/group.types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { PiUserBold } from "react-icons/pi";
import { Eye, Trash2 } from "lucide-react";
const MyGroupCard = ({
  group,
  handleOptimisticRemoveGroup,
}: {
  group: IGroup;
  handleOptimisticRemoveGroup?: (groupId: string) => void;
}) => {
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
      if (handleOptimisticRemoveGroup) {
        handleOptimisticRemoveGroup(group?._id);
      }
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
          {/* Goup Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white truncate mb-1">
              {group?.name}
            </h3>
            <p className="text-white/80 text-sm line-clamp-2">
              {group?.description || "No description available"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          <Link href={`/groups/${group?._id}`} className="w-full block">
            <button className="w-full bg-secondary cursor-pointer text-white font-medium py-2.5 px-4 rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
              <Eye size={16} />
              View Group
            </button>
          </Link>
          
          <button
            onClick={openDeleteModal}
            className="w-full border border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Remove Group
          </button>
        </div>
      </div>
      {/* Delete Group Confirmation Modal */}
      <ConfirmationPopup
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleRemoveGroup}
        type="delete"
        title="Delete Group"
        message="Are you sure you want to delete this group? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isRemoveLoading}
      />
    </>
  );
};

export default MyGroupCard;
