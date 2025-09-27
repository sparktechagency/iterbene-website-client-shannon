import { BiMessageSquareDetail } from "react-icons/bi";
import Image from "next/image";
import React from "react";
import { IChat } from "@/types/chatTypes";
import useUser from "@/hooks/useUser";
import { IUser } from "@/types/user.types";
import { getFullName } from "@/utils/nameUtils";
import { MessageType } from "@/types/messagesType";
import { useViewAllMessagesInChatMutation } from "@/redux/features/inbox/inboxApi";
import { useViewSingleMessageNotificationMutation } from "@/redux/features/notifications/notificationsApi";
import { TError } from "@/types/error";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
interface ContactListCardProps {
  contact: IChat;
}
const ContactListCard: React.FC<ContactListCardProps> = ({ contact }) => {
  const [viewAllMessagesInChat] = useViewAllMessagesInChatMutation();
  const [viewSingleMessageNotification] =
    useViewSingleMessageNotificationMutation();
  const router = useRouter();
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

  const handleViewAllMessages = async () => {
    try {
      // Mark all messages in this chat as viewed
      await viewAllMessagesInChat(contact._id).unwrap();

      // Mark single message notifications as viewed for this sender
      if (senderId) {
        try {
          await viewSingleMessageNotification(senderId).unwrap();

          // Emit custom event to immediately update Header count
          // This provides instant feedback before cache invalidation completes
          window.dispatchEvent(
            new CustomEvent("messageNotificationViewed", {
              detail: { senderId, unviewedCount: contact?.unviewedCount || 0 },
            })
          );
        } catch (notificationError) {
          const err = notificationError as TError;
          toast.error(err?.data?.message || "Something went wrong");
        }
      }

      // Navigate to messages page
      router.push(`/messages/${receiverDetails?._id}`);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      onClick={handleViewAllMessages}
      className="w-full flex items-center cursor-pointer justify-between p-4  rounded-2xl bg-white"
    >
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
          <h2 className="text-sm md:text-base ">
            {getFullName(receiverDetails ?? {})}
          </h2>
          {/* last message */}
          <p className="text-[14px] text-gray-600">{renderMessageContent()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {(contact?.unviewedCount ?? 0) > 0 ? (
          <span className="bg-primary text-white rounded-full size-5 md:size-6 flex items-center font-semibold justify-center text-sm">
            {contact?.unviewedCount ?? 0}
          </span>
        ) : (
          <BiMessageSquareDetail
            size={25}
            className="cursor-pointer text-gray-600"
          />
        )}
      </div>
    </div>
  );
};

export default ContactListCard;
