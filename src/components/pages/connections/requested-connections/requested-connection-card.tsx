import {
  useAcceptConnectionMutation,
  useDeclineConnectionMutation,
} from "@/redux/features/connections/connectionsApi";
import { IConnectionRequest } from "@/types/connection.types";
import { TError } from "@/types/error";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { UserPlus, UserX } from "lucide-react";

interface RequestedConnectionCardProps {
  request: IConnectionRequest;
  onConnectionAction?: (requestId: string) => void; // New prop for callback
}

const RequestedConnectionCard = ({
  request,
  onConnectionAction,
}: RequestedConnectionCardProps) => {
  const [acceptConnection] = useAcceptConnectionMutation();
  const [declineConnection] = useDeclineConnectionMutation();

  const handleAcceptConnection = async () => {
    try {
      await acceptConnection(request?._id).unwrap();
      toast.success("Connection accepted successfully!");

      // Optimistically remove from UI
      if (onConnectionAction) {
        onConnectionAction(request._id);
      }
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleDeclineConnection = async () => {
    try {
      await declineConnection(request?._id).unwrap();
      toast.success("Connection declined successfully!");

      // Optimistically remove from UI
      if (onConnectionAction) {
        onConnectionAction(request._id);
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
        <Link href={`/${request?.sentBy?.username}`}>
          <Image
            src={request?.sentBy?.profileImage}
            alt={request?.sentBy?.username}
            width={400}
            height={300}
            className="w-full h-full object-cover cursor-pointer"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        {/* User Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white truncate">
            {request?.sentBy?.firstName} {request?.sentBy?.lastName}
          </h3>
          <p className="text-white/80 text-sm">
            @{request?.sentBy?.username}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <button
          onClick={handleAcceptConnection}
          className="w-full bg-secondary text-white font-medium py-2.5 px-4 rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus size={16} />
          Accept
        </button>
        
        <button
          onClick={handleDeclineConnection}
          className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <UserX size={16} />
          Decline
        </button>
      </div>
    </div>
  );
};

export default RequestedConnectionCard;
