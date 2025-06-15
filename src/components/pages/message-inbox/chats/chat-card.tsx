"use client";
import useUser from "@/hooks/useUser";
import { IChat } from "@/types/chatTypes";
import { MessageType } from "@/types/messagesType";
import { IUser } from "@/types/user.types";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
interface ChatListCardProps {
  chat: IChat;
}

const ChatCard = ({ chat }: ChatListCardProps) => {
  const { lastMessage } = chat;
  const [currentTime, setCurrentTime] = useState(moment());
  const user = useUser();
  const { content, senderId, createdAt } = lastMessage || {};
  const myLastMessage = senderId === user?.id;
  const { receiverId } = useParams();

  // Get the receiver user details
  const receiverDetails: IUser | undefined = (
    chat?.participants as IUser[]
  )?.find((u: IUser) => u._id !== user?._id);

  // **Update time every minute for "x minutes ago"**
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  /** 📌 Render Last Message Content */
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
        return myLastMessage
          ? "You sent an audio message"
          : "sent an audio message";
      case MessageType.VIDEO:
        return myLastMessage ? "You sent a video" : "sent a video";
      case MessageType.DOCUMENT:
        return myLastMessage ? "You sent a document" : "sent a document";
      case MessageType.MIXED:
        return myLastMessage
          ? "You sent a mixed message"
          : "sent a mixed message";
      default:
        return "";
    }
  };

  return (
    <Link href={`/messages/${receiverDetails?._id}`} className="block">
      <div
        className={`w-full flex items-center justify-between p-4 border  rounded-2xl cursor-pointer ${
          receiverDetails?._id === receiverId
            ? "bg-[#C4F5F0] border-[#C4F5F0]"
            : "bg-white border-[#CCC0DB]"
        }`}
      >
        <div className="flex items-center gap-3">
          {receiverDetails?.profileImage && (
            <Image
              src={receiverDetails?.profileImage}
              alt={receiverDetails?.username || "User"}
              width={55}
              height={55}
              className="size-[55px] rounded-full object-cover flex-shrink-0"
            />
          )}

          <div>
            <h1 className="text-[18px] font-medium">
              {receiverDetails?.fullName}
            </h1>
            <p className="text-xs text-gray-600">{renderMessageContent()}</p>
          </div>
        </div>
        <p>
          {createdAt && (
            <p className="text-[#999999] text-xs">
              {moment(createdAt).from(currentTime)}
            </p>
          )}
        </p>
      </div>
    </Link>
  );
};

export default ChatCard;
