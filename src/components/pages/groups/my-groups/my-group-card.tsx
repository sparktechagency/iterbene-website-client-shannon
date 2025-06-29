// import { IGroup } from "@/types/group";
// import Image from "next/image";
// import Link from "next/link";
// import React from "react";
// import { PiUserBold } from "react-icons/pi";
// const MyGroupCard = ({ group} : { group: IGroup }) => {
//   return (
//     <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
//       {/* Group Image */}
//       <div className="w-full h-[350px] bg-gray-200 rounded-xl mb-4 relative">
//         <Image
//           src={group?.groupImage}
//           alt={group?.name}
//           width={350}
//           height={350}
//           className="w-full h-full object-cover rounded-2xl mb-4"
//         />
//         <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-950/20 rounded-xl"></div>
//         {/* Member Count Overlay */}
//         <div className="absolute top-5 right-5 bg-white rounded-full px-4 py-2 flex items-center gap-1">
//           <PiUserBold size={24} className="text-secondary" />
//           <span className="text-sm font-semibold text-gray-800">{group?.participantCount}</span>
//         </div>
//         {/* Group Name */}
//         <h2 className="text-2xl md:text-[32px] font-bold text-white absolute bottom-4 left-2">
//           {group?.name}
//         </h2>
//       </div>

//       {/* Buttons */}
//       <div className="flex flex-col gap-3 w-full">
//         <button className="bg-secondary  text-white  px-5 py-3.5 rounded-xl border border-secondary cursor-pointer">
//           <Link href={`/groups/1`}>View</Link>
//         </button>
//         <button className="border border-[#9EA1B3] text-gray-900 px-5 py-3.5   rounded-xl cursor-pointer">
//           Remove
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MyGroupCard;

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
const MyGroupCard = ({ group }: { group: IGroup }) => {
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
