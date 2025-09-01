import {
  useAcceptConnectionMutation,
  useDeclineConnectionMutation,
} from "@/redux/features/connections/connectionsApi";
import { IConnectionRequest } from "@/types/connection.types";
import { TError } from "@/types/error";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

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
    <div className="w-full h-fit bg-white rounded-2xl p-4 flex flex-row md:flex-col gap-4 items-center">
      {/* Profile Image */}
      <Link className="flex-shrink-0" href={`/${request?.sentBy?.username}`}>
        <Image
          src={request?.sentBy?.profileImage}
          alt={request?.sentBy?.username}
          width={224}
          height={224}
          className="size-16 md:w-full md:h-56 object-cover rounded-full md:rounded-2xl"
        />
      </Link>
      <div className="w-full">
        {/* Name */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3 text-left">
          {request?.sentBy?.firstName} {request?.sentBy?.lastName}
        </h2>

        {/* Buttons */}
        <div className="flex flex-row md:flex-col gap-4">
          <button
            onClick={handleAcceptConnection}
            className="w-full bg-secondary text-white px-4 py-2.5 text-sm md:text-base rounded-xl cursor-pointer"
          >
            Accept
          </button>
          <button
            onClick={handleDeclineConnection}
            className="w-full border border-[#9EA1B3] text-gray-900 px-4 py-2.5 text-sm md:text-base rounded-xl hover:bg-gray-100 transition cursor-pointer"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestedConnectionCard;
