"use client";
import useUser from "@/hooks/useUser";
import { IChat } from "@/types/chatTypes";
import { MessageType } from "@/types/messagesType";
import { IUser } from "@/types/user.types";
import { getMessengerTimeFormat } from "@/utils/getMessengerTimeFormat";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ChatListCardProps {
  chat: IChat;
}

const ChatCard = ({ chat }: ChatListCardProps) => {
  const { lastMessage } = chat;
  const user = useUser();
  const { content, senderId, createdAt } = lastMessage || {};
  const myLastMessage = senderId === user?._id;
  const { receiverId } = useParams();

  const receiverDetails: Partial<IUser> | undefined = chat?.participants.find(
    (p: Partial<IUser> | string) =>
      (typeof p === "string" ? p : p._id) !== user?._id
  ) as Partial<IUser> | undefined;

  const renderMessageContent = () => {
    if (!content) return "";

    switch (content.messageType) {
      case MessageType.TEXT:
        return `${myLastMessage ? "You: " : ""}${
          content.text && content.text.length > 20
            ? `${content.text.slice(0, 20)}...`
            : content.text
        }`;
      case MessageType.IMAGE:
        return myLastMessage ? "You sent a photo" : "sent a photo";
      case MessageType.AUDIO:
        return myLastMessage ? "You sent an audio message" : "sent an audio message";
      case MessageType.VIDEO:
        return myLastMessage ? "You sent a video" : "sent a video";
      case MessageType.DOCUMENT:
        return myLastMessage ? "You sent a document" : "sent a document";
      case MessageType.MIXED:
        return myLastMessage ? "You sent a mixed message" : "sent a mixed message";
      default:
        return "";
    }
  };

  return (
    <Link href={`/messages/${receiverDetails?._id}`} className="block">
      <div
        className={`w-full flex items-center justify-between p-4 border rounded-2xl cursor-pointer ${
          receiverDetails?._id === receiverId
            ? "bg-[#C4F5F0] border-[#C4F5F0]"
            : "bg-white border-[#CCC0DB]"
        }`}
      >
        <div className="flex items-center gap-3">
          {receiverDetails?.profileImage && (
            <Image
              src={receiverDetails.profileImage}
              alt={receiverDetails?.username || "User"}
              width={50}
              height={50}
              className="size-[50px] rounded-full object-cover flex-shrink-0"
            />
          )}

          <div>
            <h1 className="text-[18px] font-medium">
              {receiverDetails?.fullName || "Unknown User"}
            </h1>
            <p className="text-[14px] text-gray-600">{renderMessageContent()}</p>
          </div>
        </div>
        <>
          {createdAt && (
            <p className="text-[#999999] text-[14px]">
              {getMessengerTimeFormat(createdAt)}
            </p>
          )}
        </>
      </div>
    </Link>
  );
};

export default ChatCard;