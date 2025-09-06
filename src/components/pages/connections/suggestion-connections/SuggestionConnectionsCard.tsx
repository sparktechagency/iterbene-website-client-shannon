import {
  useAddConnectionMutation,
  useRemoveSuggestionConnectionMutation,
} from "@/redux/features/connections/connectionsApi";
import { IConnection } from "@/types/connection.types";
import { TError } from "@/types/error";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

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
    <div className="w-full h-fit bg-white rounded-2xl p-4 flex flex-row md:flex-col gap-3 items-center">
      {/* Profile Image */}
      <Link className="flex-shrink-0" href={`/${connection?.username}`}>
        <Image
          src={connection?.profileImage}
          alt={connection?.username}
          width={208}
          height={208}
          className="size-16 md:w-full md:h-52 object-cover rounded-full md:rounded-2xl"
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
            onClick={handleAddConnection}
            className="bg-[#FEEFE8] text-secondary px-3.5 py-2 text-sm md:text-base rounded-xl border border-secondary transition cursor-pointer"
          >
            Add Connection
          </button>
          <button
            onClick={handleRemoveConnection}
            className="border border-[#9EA1B3] text-gray-900 px-6 py-2 text-sm md:text-base rounded-xl hover:bg-gray-100 transition cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestionConnectionsCard;
