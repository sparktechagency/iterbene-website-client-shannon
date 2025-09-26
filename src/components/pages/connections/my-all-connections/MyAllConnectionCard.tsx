import ConfirmationPopup from "@/components/custom/custom-popup";
import { useBlockUserMutation } from "@/redux/features/blockUser/blockUserApi";
import { useRemoveConnectionMutation } from "@/redux/features/connections/connectionsApi";
import { IConnection } from "@/types/connection.types";
import { TError } from "@/types/error";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { UserMinus, Shield } from "lucide-react";

interface MyAllConnectionCardCardProps {
  connection: IConnection;
  handleConnectionAction: (connectionId: string) => void;
}

const MyAllConnectionCard = ({
  connection,
  handleConnectionAction,
}: MyAllConnectionCardCardProps) => {
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
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Profile Image */}
      <div className="relative w-full h-48 sm:h-52 md:h-56 overflow-hidden">
        <Link href={`/${connection?.username}`}>
          <Image
            src={connection?.profileImage}
            alt={connection?.username}
            width={400}
            height={300}
            className="w-full h-full object-cover cursor-pointer"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        {/* User Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white truncate">
            {connection?.firstName} {connection?.lastName}
          </h3>
          <p className="text-white/80 text-sm">@{connection?.username}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <button
          onClick={() => setRemoveConnectionPopup(true)}
          className="w-full bg-secondary cursor-pointer text-white font-medium py-2.5 px-4 rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
        >
          <UserMinus size={16} />
          Remove Connection
        </button>

        <button
          onClick={() => setBlockUserPopup(true)}
          className="w-full border border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Shield size={16} />
          Block User
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
  );
};

export default MyAllConnectionCard;
