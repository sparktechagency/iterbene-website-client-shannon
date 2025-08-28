import CustomButton from "@/components/custom/custom-button";
import { useAcceptConnectionMutation, useDeclineConnectionMutation } from "@/redux/features/connections/connectionsApi";
import { IConnectionRequest } from "@/types/connection.types";
import { TError } from "@/types/error";
import { getFullName } from "@/utils/nameUtils";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

const FriendRequestCard = ({ request }: { request: IConnectionRequest }) => {
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
    <div className="w-full bg-white p-6  rounded-2xl">
      <div className="flex items-center">
        <Image
          src={request?.sentBy?.profileImage}
          alt="Profile"
          width={60}
          height={60}
          className="size-[60px] rounded-full object-cover mr-4 ring ring-primary flex-shrink-0"
        />
        <h1>
          <Link href={`/${request?.sentBy?.username}`}>
            <span className="text-[18px] font-bold">
              {getFullName(request?.sentBy)}
            </span>{" "}
          </Link>
          <span className="text-[18px] text-gray-500">
            wants to add you to friends
          </span>
        </h1>
      </div>
      <div className="mt-5 flex justify-between gap-4 items-center">
        <CustomButton onClick={handleAcceptConnection} variant="default" className="px-5 py-3" fullWidth>
          Accept
        </CustomButton>
        <CustomButton onClick={handleDeclineConnection} variant="outline" className="px-5 py-3" fullWidth>
          Decline
        </CustomButton>
      </div>
    </div>
  );
};

export default FriendRequestCard;
