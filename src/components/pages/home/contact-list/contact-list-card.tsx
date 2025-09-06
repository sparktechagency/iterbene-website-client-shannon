import { BiMessageSquareDetail } from "react-icons/bi";
import Image from "next/image";
import React from "react";
import { IChat } from "@/types/chatTypes";
import useUser from "@/hooks/useUser";
import { IUser } from "@/types/user.types";
import { getFullName } from "@/utils/nameUtils";
import Link from "next/link";
import { MessageType } from "@/types/messagesType";
interface ContactListCardProps {
  contact: IChat;
}
const ContactListCard: React.FC<ContactListCardProps> = ({ contact }) => {
  const user = useUser();
  // Get the receiver user details
  const receiverDetails: IUser | undefined = (
    contact?.participants as IUser[]
  )?.find((u: IUser) => u._id !== user?._id);
  const { content, senderId } = contact.lastMessage || {};

  const myLastMessage = senderId === user?._id;

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
        return `${myLastMessage ? "You: " : ""}${
          content.text && content.text.length > 20
            ? `${content.text.slice(0, 20)}...`
            : content.text
        }`;
      case MessageType.STORYMESSAGE:
        return myLastMessage ? "You replied to a story" : "replied to a story";
      default:
        return "";
    }
  };
  return (
    <Link href={`/messages/${receiverDetails?._id}`}>
      <div className="w-full flex items-center justify-between p-4  rounded-2xl bg-white">
        <div className="flex items-center">
          {receiverDetails?.profileImage && (
            <Image
              src={receiverDetails?.profileImage}
              alt="Profile"
              width={60}
              height={60}
              className="size-[60px] ring ring-primary rounded-full object-cover mr-4"
            />
          )}
          <div>
            {/* full name */}
            <h2 className="text-sm md:text-base ">{getFullName(receiverDetails?? {})}</h2>
            {/* last message */}
            <p className="text-[14px] text-gray-600">
              {renderMessageContent()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {(contact?.unviewedCount ?? 0) > 0 ? (
            <span className="bg-primary text-white rounded-full size-8 flex items-center font-semibold justify-center text-sm">
              {contact?.unviewedCount ?? 0}
            </span>
          ) : (
            <BiMessageSquareDetail size={25} className="cursor-pointer" />
          )}
        </div>
      </div>
    </Link>
  );
};

export default ContactListCard;
