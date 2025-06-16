import React from "react";
import Image from "next/image";
import moment from "moment";
import { IMessage, MessageType } from "@/types/messagesType";
import "yet-another-react-lightbox/styles.css";
import Link from "next/link";
import pdf from "@/asset/message/pdf.png";
import { IUser } from "@/types/user.types";

interface MessageItemProps {
  message: IMessage;
  isMyMessage: boolean;
  receiverInfo: IUser;
  onOpenLightbox: (images: string[]) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isMyMessage,
  receiverInfo,
  onOpenLightbox,
}) => {
  const fileUrls = message?.content?.fileUrls || [];

  return (
    <div
      className={`flex ${
        isMyMessage ? "justify-end" : "justify-start"
      } items-end gap-3`}
    >
      {/* Sender/Receiver Image */}
      {!isMyMessage && receiverInfo?.profileImage && (
        <Image
          src={`${receiverInfo?.profileImage}`}
          alt="profile"
          width={40}
          height={40}
          className="size-10 md:size-12 object-cover rounded-full flex-shrink-0"
        />
      )}

      {/* Message Content */}
      <div
        className={`w-full max-w-[300px] md:max-w-[500px] flex flex-col justify-between ${
          isMyMessage ? "items-end" : "items-start"
        } flex-shrink-0`}
      >
        {/* Mixed Content */}
        {message?.content?.messageType === MessageType.MIXED && (
          <div
            className={`flex flex-col justify-between items-end space-y-1 group ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              } `}
            >
              {moment(message?.createdAt).format("h:mm A")}
            </span>
            <div
              className="relative cursor-pointer"
              onClick={() => onOpenLightbox(fileUrls)}
            >
              <Image
                src={`${fileUrls[0]}`}
                alt="image"
                width={200}
                height={200}
                className="object-cover rounded-xl"
              />
              {fileUrls?.length >= 2 && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-lg font-bold rounded-xl">
                  +{fileUrls?.length - 1}
                </div>
              )}
            </div>
            <div
              className={`flex flex-col justify-between ${
                isMyMessage ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-fit p-3 rounded-xl ${
                  isMyMessage
                    ? "bg-[#E6E6E6] text-gray-800"
                    : "bg-[#ECFCFA] text-[#1A1A1A]"
                }`}
              >
                {message?.content?.text}
              </div>
            </div>
          </div>
        )}

        {/* Text Message */}
        {message?.content?.messageType === MessageType.TEXT && (
          <div
            className={`w-full max-w-fit flex flex-col justify-between items-end space-y-1 group ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              } `}
            >
              {moment(message?.createdAt).format("h:mm A")}
            </span>
            <div
              className={`max-w-md p-3 rounded-xl ${
                isMyMessage
                  ? "bg-[#E6E6E6] text-gray-800"
                  : "bg-[#ECFCFA] text-[#1A1A1A]"
              }`}
            >
              {message?.content?.text}
            </div>
          </div>
        )}

        {/* Image Message */}
        {message?.content?.messageType === MessageType.IMAGE && (
          <div
            className={`group flex flex-col justify-between items-end ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              } `}
            >
              {moment(message?.createdAt).format("h:mm A")}
            </span>
            <div
              className="relative cursor-pointer"
              onClick={() => onOpenLightbox(fileUrls)}
            >
              <Image
                src={`${fileUrls[0]}`}
                alt="image"
                width={200}
                height={200}
                className="rounded-xl"
              />
              {fileUrls.length >= 2 && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-lg font-bold rounded-xl">
                  +{fileUrls.length - 1}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Audio Message */}
        {message?.content?.messageType === MessageType.AUDIO && (
          <div>
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              } `}
            >
              {moment(message?.createdAt).format("h:mm A")}
            </span>
            <audio controls>
              <source src={`${fileUrls[0]}`} type="audio/mpeg" />
            </audio>
          </div>
        )}

        {/* Video Message */}
        {message?.content?.messageType === MessageType.VIDEO && (
          <div>
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              } `}
            >
              {moment(message?.createdAt).format("h:mm A")}
            </span>
            <video controls width="250">
              <source src={`${fileUrls[0]}`} type="video/mp4" />
            </video>
          </div>
        )}

        {/* Document Message */}
        {message?.content?.messageType === MessageType.DOCUMENT && (
          <div
            className={`flex flex-col justify-between items-end gap-2 group ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              } `}
            >
              {moment(message?.createdAt).format("h:mm A")}
            </span>
            {fileUrls?.map((fileUrl, index) => (
              <div
                key={index}
                className="w-56 relative cursor-pointer bg-[#E6E6E6] border border-gray-300 rounded-xl p-2"
              >
                <Link
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 underline"
                >
                  <Image src={pdf} width={40} height={40} alt="pdf" />
                  <span className="truncate">{fileUrl.split("/").pop()}</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;