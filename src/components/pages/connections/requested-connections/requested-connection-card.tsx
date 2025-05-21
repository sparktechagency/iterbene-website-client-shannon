import {
  useAcceptConnectionMutation,
  useDeclineConnectionMutation,
} from "@/redux/features/connections/connectionsApi";
import { IConnectionRequest } from "@/types/connection.types";
import { TError } from "@/types/error";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
const RequestedConnectionCard = ({
  request,
}: {
  request: IConnectionRequest;
}) => {
  const [acceptConnection] = useAcceptConnectionMutation();
  const [declineConnection] = useDeclineConnectionMutation();

  const handleAcceptConnection = async () => {
    try {
      await acceptConnection(request?._id).unwrap();
      toast.success("Connection accepted successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  const handleDeclineConnection = async () => {
    try {
      await declineConnection(request?._id).unwrap();
      toast.success("Connection declined successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
      {/* Profile Image */}
      <Link className="w-full" href={`/${request?.sentBy?.username}`}>
        <Image
          src={request?.sentBy?.profileImage}
          alt={request?.sentBy?.username}
          width={248}
          height={248}
          className="w-full h-56 md:h-60 lg:h-[248px] object-cover rounded-2xl mb-4"
        />
      </Link>
      {/* Name */}
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        {request?.sentBy?.fullName}
      </h2>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full">
        <button
          onClick={handleAcceptConnection}
          className="bg-secondary text-white px-5 py-3  rounded-xl cursor-pointer"
        >
          Accept
        </button>
        <button
          onClick={handleDeclineConnection}
          className="border border-[#9EA1B3] text-gray-900 px-5 py-3  rounded-xl  hover:bg-gray-100 transition cursor-pointer"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default RequestedConnectionCard;
