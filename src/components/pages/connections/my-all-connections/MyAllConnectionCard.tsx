import ConfirmationPopup from "@/components/custom/custom-popup";
import { useBlockUserMutation } from "@/redux/features/blockUser/blockUserApi";
import { useRemoveConnectionMutation } from "@/redux/features/connections/connectionsApi";
import { IConnection } from "@/types/connection.types";
import { TError } from "@/types/error";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

interface MyAllConnectionCardCardProps {
  connection: IConnection;
  handleConnectionAction: (connectionId: string) => void;
}

const MyAllConnectionCard = ({ connection,handleConnectionAction }: MyAllConnectionCardCardProps) => {
  const [isRemoveConnectionPopup, setRemoveConnectionPopup] =
    useState<boolean>(false);
  const [isBlockUserPopup, setBlockUserPopup] = useState<boolean>(false);

  // Remove Connection Mutation
  const [removeConnection, { isLoading: isRemovingConnection }] =
    useRemoveConnectionMutation();
  //block connection
  const [blockUser, { isLoading: isBlockingUser }] = useBlockUserMutation();

  const handleConfirmRemoveConnection = async () => {
    try {
      await removeConnection(connection?._id).unwrap();
      handleConnectionAction(connection?._id);
      toast.success("Remove connection successfully");
      setRemoveConnectionPopup(false);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleConfirmBlockUser = async () => {
    try {
      await blockUser(connection?._id).unwrap();
      handleConnectionAction(connection?._id);
      toast.success("Block User Successfully");
      setBlockUserPopup(false);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full h-fit bg-white rounded-2xl p-4 flex flex-row md:flex-col gap-4 items-center">
      {/* Profile Image */}
      <Link className="flex-shrink-0" href={`/${connection?.username}`}>
        <Image
          src={connection?.profileImage}
          alt={connection?.username}
          width={224}
          height={224}
          className="size-16 md:w-full md:h-56 object-cover rounded-full md:rounded-2xl"
        />
      </Link>
      <div className="w-full">
        {/* Name */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2 text-left">
          {connection?.firstName} {connection?.lastName}
        </h2>
        {/* Buttons */}
        <div className="w-full flex flex-row md:flex-col gap-4">
          <button
            onClick={() => setRemoveConnectionPopup(true)}
            className="bg-[#FEEFE8] text-secondary px-3.5 py-2.5 text-sm md:text-base rounded-xl border border-secondary transition cursor-pointer"
          >
            Remove Connection
          </button>
          <button
            onClick={() => setBlockUserPopup(true)}
            className="border border-[#9EA1B3] text-gray-900 px-6 py-2.5 text-sm md:text-base rounded-xl hover:bg-gray-100 transition cursor-pointer"
          >
            Block
          </button>
        </div>
        {/* Remove connection popup */}
        <ConfirmationPopup
          isOpen={isRemoveConnectionPopup}
          onClose={() => setRemoveConnectionPopup(false)}
          onConfirm={handleConfirmRemoveConnection}
          type="delete"
          title="Remove Connection"
          message="Are you sure you want to remove connection? This action cannot be undone."
          confirmText="Remove"
          cancelText="Cancel"
          isLoading={isRemovingConnection}
        />
        {/* Block popup */}
        <ConfirmationPopup
          isOpen={isBlockUserPopup}
          onClose={() => setBlockUserPopup(false)}
          onConfirm={handleConfirmBlockUser}
          type="delete"
          title="Block User"
          message="Are you sure you want to block this user? This action cannot be undone."
          confirmText="Yes"
          cancelText="No"
          isLoading={isBlockingUser}
        />
      </div>
    </div>
  );
};

export default MyAllConnectionCard;
