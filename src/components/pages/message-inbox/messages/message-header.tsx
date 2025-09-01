"use client";
import { useGetSingleByUserIdQuery } from "@/redux/features/users/userApi";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const MessageHeader = () => {
  const { receiverId } = useParams();
  const router = useRouter();
  const { data: result } = useGetSingleByUserIdQuery(receiverId, {
    refetchOnMountOrArgChange: true,
    skip: !receiverId,
  });
  const receiverInfo = result?.data?.attributes;

  const handleBack = () => {
    router.push("/messages");
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-300">
      <button onClick={handleBack} className="md:hidden mr-4 cursor-pointer">
        <ChevronLeft size={28} />
      </button>
      <div className="flex items-center space-x-2">
        {receiverInfo?.isOnline ? (
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        ) : (
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        )}
        <Link href={`/${receiverInfo?.username}`}>
          <h1 className="text-lg md:text-xl cursor-pointer  font-semibold text-gray-800">
           {receiverInfo?.firstName} {receiverInfo?.lastName}
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default MessageHeader;
