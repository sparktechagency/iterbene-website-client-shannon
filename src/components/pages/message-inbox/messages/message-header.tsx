"use client";
import { useGetSingleByUserIdQuery } from "@/redux/features/users/userApi";
import { useParams } from "next/navigation";

const MessageHeader = () => {
  const { receiverId } = useParams();
  const { data: result } = useGetSingleByUserIdQuery(receiverId, {
    refetchOnMountOrArgChange: true,
    skip: !receiverId,
  });
  const receiverInfo = result?.data?.attributes;
  return (
    <div className="flex items-center p-4">
      <div className="flex items-center space-x-2">
        {receiverInfo?.isOnline ? (
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        ) : (
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        )}
        <h1 className="text-xl font-semibold text-gray-800">
          {receiverInfo?.fullName}
        </h1>
      </div>
    </div>
  );
};

export default MessageHeader;
