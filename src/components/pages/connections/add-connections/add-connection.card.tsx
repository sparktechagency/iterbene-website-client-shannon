import {
  useAddConnectionMutation,
  useCancelConnectionMutation,
  useCheckIsSentConnectionExistsQuery,
  useRemoveSuggestionConnectionMutation,
} from "@/redux/features/connections/connectionsApi";
import { IConnection } from "@/types/connection.types";
import { TError } from "@/types/error";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
const AddConnectionCard = ({ connection }: { connection: IConnection }) => {
  const { data: responseData } = useCheckIsSentConnectionExistsQuery(
    connection?.id,
    {
      skip: !connection?.id,
    }
  );
  const [addConnection] = useAddConnectionMutation();
  const [removeConnection] = useRemoveSuggestionConnectionMutation();
  const [cancelRequest] = useCancelConnectionMutation();
  const checkSentConnectionExist = responseData?.data?.attributes;

  const handleAddConnection = async () => {
    try {
      const payload = { receivedBy: connection?.id };
      await addConnection(payload).unwrap();
      toast.success("Connection sent successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  const handleCancelRequest = async () => {
    try {
      await cancelRequest(connection?.id).unwrap();
      toast.success("Request canceled successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleRemoveConnection = async () => {
    try {
      await removeConnection(connection?.id).unwrap();
      toast.success("Connection removed successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col">
      {/* Profile Image */}
      <Link className="w-full" href={`/${connection?.username}`}>
        <Image
          src={connection?.profileImage}
          alt={connection?.username}
          width={248}
          height={248}
          className="w-full h-56 md:h-60 lg:h-[248px] object-cover rounded-2xl mb-4"
        />
      </Link>
      {/* Name */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {connection?.fullName}
      </h2>
      {/* Buttons */}
      <>
        {checkSentConnectionExist ? (
          <div className="flex flex-col justify-between gap-4 w-full">
           <h1 className="text-lg py-3 text-gray-700">Request Sent</h1>
            <button
              onClick={handleCancelRequest}
              className="border border-[#9EA1B3] text-gray-900 px-5 py-3   rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel Request
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-between gap-4 w-full">
            <button
              onClick={handleAddConnection}
              className="bg-[#FEEFE8] text-secondary px-5 py-3  border border-secondary  rounded-xl transition cursor-pointer"
            >
              Add Connection
            </button>
            <button
              onClick={handleRemoveConnection}
              className="border border-[#9EA1B3] text-gray-900 px-5 py-3   rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}
      </>
    </div>
  );
};

export default AddConnectionCard;
