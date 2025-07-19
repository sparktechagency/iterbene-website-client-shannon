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
  onOpenLightbox: (images: string[], initialIndex?: number) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isMyMessage,
  receiverInfo,
  onOpenLightbox,
}) => {
  const fileUrls = message?.content?.fileUrls || [];

  // Limit displayed images to 2
  const displayedImages = fileUrls.slice(0, 2);
  const extraImagesCount = fileUrls.length - displayedImages.length;

  return (
    <div
      className={`flex ${
        isMyMessage ? "justify-end" : "justify-start"
      } items-end gap-3 mb-3`}
    >
      {/* Sender/Receiver Image */}
      {!isMyMessage && receiverInfo?.profileImage && (
        <Image
          src={receiverInfo.profileImage}
          alt="profile"
          width={40}
          height={40}
          className="size-10 md:size-12 object-cover rounded-full flex-shrink-0"
        />
      )}

      {/* Message Content */}
      <div
        className={`w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] flex flex-col ${
          isMyMessage ? "items-end" : "items-start"
        } flex-shrink-0`}
      >
        {/* Mixed Content */}
        {message?.content?.messageType === MessageType.MIXED && (
          <div
            className={`flex flex-col space-y-1 ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              }`}
            >
              {moment(message.createdAt).format("h:mm A")}
            </span>
            {fileUrls.length > 0 && (
              <div
                className="flex flex-row gap-1 w-full overflow-hidden"
                style={{ maxHeight: "120px" }}
              >
                {displayedImages.map((url, index) => (
                  <div
                    key={index}
                    className="relative flex-shrink-0 cursor-pointer"
                    style={{ width: "100px", height: "120px" }}
                    onClick={() => onOpenLightbox(fileUrls, index)}
                  >
                    <Image
                      src={url}
                      alt={`image-${index}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    {index === 1 && extraImagesCount > 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold rounded-lg">
                        +{extraImagesCount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div
              className={`max-w-fit p-3 rounded-xl mt-2 ${
                isMyMessage
                  ? "bg-[#E6E6E6] text-gray-800"
                  : "bg-[#ECFCFA] text-[#1A1A1A]"
              }`}
            >
              {message.content.text}
            </div>
          </div>
        )}

        {/* Text Message */}
        {message?.content?.messageType === MessageType.TEXT && (
          <div
            className={`flex flex-col space-y-1 ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              }`}
            >
              {moment(message.createdAt).format("h:mm A")}
            </span>
            <div
              className={`max-w-fit p-3 rounded-xl ${
                isMyMessage
                  ? "bg-[#E6E6E6] text-gray-800"
                  : "bg-[#ECFCFA] text-[#1A1A1A]"
              }`}
            >
              {message.content.text}
            </div>
          </div>
        )}

        {/* Image Message */}
        {message?.content?.messageType === MessageType.IMAGE && (
          <div
            className={`flex flex-col space-y-1 ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              }`}
            >
              {moment(message.createdAt).format("h:mm A")}
            </span>
            <div
              className="flex flex-row gap-1 w-full overflow-hidden"
              style={{ maxHeight: "120px" }}
            >
              {displayedImages.map((url, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0 cursor-pointer"
                  onClick={() => onOpenLightbox(fileUrls, index)}
                >
                  <Image
                    src={url}
                    alt={`image-${index}`}
                    width={150}
                    height={150}
                    className="w-[120px] h-[120px] object-cover rounded-lg"
                  />
                  {index === 1 && extraImagesCount > 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold rounded-lg">
                      +{extraImagesCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audio Message */}
        {message?.content?.messageType === MessageType.AUDIO && (
          <div className="flex flex-col space-y-1">
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              }`}
            >
              {moment(message.createdAt).format("h:mm A")}
            </span>
            <audio controls className="max-w-full">
              <source src={fileUrls[0]} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Video Message */}
        {message?.content?.messageType === MessageType.VIDEO && (
          <div className="flex flex-col space-y-1">
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              }`}
            >
              {moment(message.createdAt).format("h:mm A")}
            </span>
            <video controls className="max-w-full rounded-lg">
              <source src={fileUrls[0]} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>
        )}
        {/* Document Message */}
        {message?.content?.messageType === MessageType.DOCUMENT && (
          <div
            className={`flex flex-col space-y-1 ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              }`}
            >
              {moment(message.createdAt).format("h:mm A")}
            </span>
            {fileUrls.map((fileUrl, index) => {
              const fileName = decodeURIComponent(
                fileUrl.split("/").pop()?.split("?")[0] || `file-${index}`
              );
              return (
                <div
                  key={index}
                  className={`w-56 bg-[#E6E6E6] border border-gray-300 rounded-lg p-2 flex items-center gap-2 ${
                    isMyMessage ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Image src={pdf} width={32} height={32} alt="pdf" />
                  <Link
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate text-sm"
                    title={fileName}
                  >
                    {fileName}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
        {/* Story Message */}
        {message?.content?.messageType === MessageType.STORYMESSAGE && (
          <div
            className={`flex flex-col space-y-1 ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              }`}
            >
              {moment(message.createdAt).format("h:mm A")}
            </span>
            {/* user friendly message for story */}
            <div className="text-xs text-gray-500 mb-1">
              {isMyMessage
                ? `You replied to ${receiverInfo?.fullName}'s journey`
                : `${receiverInfo?.fullName} replied to your journey`}
            </div>
            {/* Image */}
            <div>
              {message?.storyMedia?.mediaUrl ? (
                <Image
                  src={message?.storyMedia?.mediaUrl || ""}
                  alt={`Story Image`}
                  width={150}
                  height={150}
                  className="w-[120px] h-[120px] object-cover rounded-lg"
                />
              ) : (
                <div className="w-[120px] h-[120px] bg-slate-100 flex items-center justify-center rounded-lg">
                  <h1 className="text-xs text-gray-700 text-center">
                    Journey no longer available
                  </h1>
                </div>
              )}

              {/* Text */}
              {message.content.text && (
                <div
                  className={`max-w-fit p-3 rounded-xl mt-2 ${
                    isMyMessage
                      ? "bg-[#E6E6E6] text-gray-800"
                      : "bg-[#ECFCFA] text-[#1A1A1A]"
                  }`}
                >
                  {message.content.text}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
