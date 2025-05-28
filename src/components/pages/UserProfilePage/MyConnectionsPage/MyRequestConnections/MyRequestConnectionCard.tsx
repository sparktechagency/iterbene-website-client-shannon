import CustomButton from "@/components/custom/custom-button";
import {
  useAcceptConnectionMutation,
  useDeclineConnectionMutation,
} from "@/redux/features/connections/connectionsApi";
import { IConnectionRequest } from "@/types/connection.types";
import { TError } from "@/types/error";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";

const MyRequestConnectionCard = ({
  connection,
}: {
  connection: IConnectionRequest;
}) => {
  const [acceptConnection, { isLoading: acceptLoading }] =
    useAcceptConnectionMutation();
  const [declineConnection, { isLoading: declineLoading }] =
    useDeclineConnectionMutation();

  const handleAcceptConnection = async () => {
    try {
      await acceptConnection(connection?._id).unwrap();
      toast.success("Connection accepted successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  const handleDeclineConnection = async () => {
    try {
      await declineConnection(connection?._id).unwrap();
      toast.success("Connection declined successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl">
      <Link href={`/${connection?.sentBy?.username}`}>
        <div className="flex items-center space-x-4">
          <Image
            src={connection?.sentBy?.profileImage}
            alt={connection?.sentBy?.fullName}
            width={70}
            height={70}
            className="w-[70px] h-[70px] rounded-full object-cover ring-2 ring-gray-300"
          />
          <div className="flex flex-col">
            <span className="text-gray-800 font-semibold text-lg">
              {connection?.sentBy?.fullName}
            </span>
            <span className="text-gray-600">
              @{connection?.sentBy?.username}
            </span>
          </div>
        </div>
      </Link>
      <div className="flex items-center space-x-2">
        <CustomButton
          onClick={handleDeclineConnection}
          loading={acceptLoading}
          variant="default"
        >
          Accept
        </CustomButton>
        <CustomButton
          onClick={handleAcceptConnection}
          loading={declineLoading}
          variant="outline"
        >
          Decline
        </CustomButton>
      </div>
    </div>
  );
};

export default MyRequestConnectionCard;
