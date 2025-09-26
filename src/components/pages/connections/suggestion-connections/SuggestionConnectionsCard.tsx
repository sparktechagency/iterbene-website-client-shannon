import {
  useAddConnectionMutation,
  useRemoveSuggestionConnectionMutation,
} from "@/redux/features/connections/connectionsApi";
import { IConnection } from "@/types/connection.types";
import { TError } from "@/types/error";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { UserPlus, UserX } from "lucide-react";

interface SuggestionConnectionsCardProps {
  connection: IConnection;
  onConnectionAction?: (connectionId: string) => void; // New prop for callback
}

const SuggestionConnectionsCard = ({
  connection,
  onConnectionAction,
}: SuggestionConnectionsCardProps) => {
  const [addConnection] = useAddConnectionMutation();
  const [removeConnection] = useRemoveSuggestionConnectionMutation();

  const handleAddConnection = async () => {
    try {
      const payload = { receivedBy: connection?._id };
      await addConnection(payload).unwrap();
      toast.success("Connection sent successfully!");

      // Optimistically remove from UI
      if (onConnectionAction) {
        onConnectionAction(connection._id);
      }
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleRemoveConnection = async () => {
    try {
      await removeConnection(connection?._id).unwrap();
      toast.success("Connection removed successfully!");

      // Optimistically remove from UI
      if (onConnectionAction) {
        onConnectionAction(connection._id);
      }
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
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
          <p className="text-white/80 text-sm">
            @{connection?.username}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <button
          onClick={handleAddConnection}
          className="w-full bg-secondary cursor-pointer text-white font-medium py-2.5 px-4 rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus size={16} />
          Add Connection
        </button>
        
        <button
          onClick={handleRemoveConnection}
          className="w-full border cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <UserX size={16} />
          Remove
        </button>
      </div>
    </div>
  );
};

export default SuggestionConnectionsCard;
