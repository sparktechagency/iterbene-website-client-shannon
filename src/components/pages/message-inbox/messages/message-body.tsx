"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useGetMessagesQuery } from "@/redux/features/inbox/inboxApi";
import { useParams } from "next/navigation";
import useUser from "@/hooks/useUser";
import moment from "moment";
import Skeleton from "@/components/custom/custom-skeleton";
import { IMessage, MessageType } from "@/types/messagesType";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useGetSingleByUserIdQuery } from "@/redux/features/users/userApi";
import Link from "next/link";
import pdf from "@/asset/message/pdf.png";
const MessageBody = () => {
  const { receiverId } = useParams();
  const user = useUser();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const { data: result } = useGetSingleByUserIdQuery(receiverId, {
    refetchOnMountOrArgChange: true,
    skip: !receiverId,
  });
  const receiverInfo = result?.data?.attributes;
  // Fetch messages
  const { data: responseData, isLoading: messagesLoading } =
    useGetMessagesQuery(receiverId, {
      refetchOnMountOrArgChange: true,
      pollingInterval: 60000, // Poll every 1 minute
      skip: !receiverId,
    });

  const allMessages = useMemo(
    () => responseData?.data?.attributes?.results || [],
    [responseData]
  );
  const openLightbox = (images: string[]) => {
    setLightboxImages(images);
    setLightboxOpen(true);
  };
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      // Select the messages container and scroll to the bottom
      const messagesBox = document.querySelector(".messages-box");
      if (messagesBox) {
        messagesBox.scrollTop = messagesBox.scrollHeight; // Scroll to bottom
      }

      // Focus on the input field after scrolling
      const inputField = document.getElementById(
        "input-message"
      ) as HTMLTextAreaElement | null;
      if (inputField) {
        inputField.focus();
      }
    }, 100); // Small delay ensures UI updates before scrolling
  }, [allMessages]);
  return (
    <div
      ref={messagesRef}
      className="w-full  p-4 space-y-5 h-[calc(85vh-175px)] relative messages-box"
    >
      {messagesLoading
        ? Array.from({ length: 5 }).map((_, index) => {
            const isMyMessage = index % 2 === 0; // Simulating sender/receiver alternation
            return (
              <div
                key={index}
                className={`flex ${
                  isMyMessage ? "justify-end" : "justify-start"
                } items-end gap-3`}
              >
                {/* Sender/Receiver Image */}
                {!isMyMessage && (
                  <Skeleton
                    width="45px"
                    height="45px"
                    className="rounded-full"
                  />
                )}

                {/* Message Content */}
                <Skeleton width="200px" height="30px" className="rounded-xl" />
              </div>
            );
          })
        : allMessages.map((message: IMessage) => {
            const isMyMessage = message?.senderId === user?._id;
            const fileUrls = message?.content?.fileUrls || [];
            return (
              <div
                key={message?._id}
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
                  className={`w-full  max-w-[300px] md:max-w-[500px] flex flex-col justify-between  ${
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
                        onClick={() => openLightbox(fileUrls)}
                      >
                        <Image
                          src={`${fileUrls[0]}`}
                          alt="image"
                          width={200}
                          height={200}
                          className="object-cover rounded-xl"
                        />
                        {fileUrls?.length >= 2 && (
                          <div className="absolute top-0 left-0 w-full h-full  flex items-center justify-center text-white text-lg font-bold rounded-xl">
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
                        onClick={() => openLightbox(fileUrls)}
                      >
                        <Image
                          src={`${fileUrls[0]}`}
                          alt="image"
                          width={200}
                          height={200}
                          className="rounded-xl"
                        />
                        {fileUrls.length >= 2 && (
                          <div className="absolute top-0 left-0 w-full h-full  flex items-center justify-center text-white text-lg font-bold rounded-xl">
                            +{fileUrls.length - 1}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Audio Message */}
                  {message?.content?.messageType === MessageType.AUDIO && (
                    <div>
                      <audio controls>
                        <source src={`${fileUrls[0]}`} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}

                  {/* Video Message */}
                  {message?.content?.messageType === MessageType.VIDEO && (
                    <div>
                      <video controls width="250">
                        <source src={`${fileUrls[0]}`} type="video/mp4" />
                      </video>
                    </div>
                  )}

                  {/* Document Message */}
                  {message?.content?.messageType === MessageType.DOCUMENT && (
                    <div className={`flex flex-col justify-between items-end gap-2 group ${
                        isMyMessage ? "items-end" : "items-start"
                      }`}>
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
                            className=" flex items-center gap-3 underline"
                          >
                            <Image src={pdf} width={40} height={40} alt="pdf" />
                            <span className="truncate">
                              {fileUrl.split("/").pop()}
                            </span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxImages.map((url) => ({
            src: `${url}`,
          }))}
        />
      )}
    </div>
  );
};

export default MessageBody;

//  <div className="flex-1 p-4 overflow-y-auto space-y-4">
//     {demoMessages.map((message) => (
//       <div
//         key={message.id}
//         className={`flex ${
//           message.isSentByUser ? "justify-end" : "justify-start"
//         } items-start space-x-2`}
//       >
//         {!message.isSentByUser && (
//           <Image
//             src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
//             alt={message.sender}
//             width={40}
//             height={40}
//             className="w-10 h-10 rounded-full"
//           />
//         )}
//         <div
//           className={`flex flex-col ${
//             message.isSentByUser ? "items-end" : "items-start"
//           }`}
//         >
//           <span className={`text-sm text-gray-500 ${ message.isSentByUser ? "mr-2 mb-1" : "ml-2 mb-1"} `}>
//             {message.timeStamp}
//           </span>
//           <div
//             className={`max-w-md p-3 rounded-xl ${
//               message.isSentByUser
//                 ? "bg-[#E6E6E6] text-gray-800"
//                 : "bg-[#ECFCFA] text-[#1A1A1A]"
//             }`}
//           >
//             {message.content && <p>{message.content}</p>}
//             {message.image && (
//               <Image
//                 src={message.image}
//                 alt="Message Image"
//                 width={150}
//                 height={150}
//                 className="mt-2 rounded-lg"
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
