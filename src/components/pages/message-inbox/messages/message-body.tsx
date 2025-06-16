"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGetMessagesQuery } from "@/redux/features/inbox/inboxApi";
import { useParams } from "next/navigation";
import useUser from "@/hooks/useUser";
import { IMessage } from "@/types/messagesType";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useGetSingleByUserIdQuery } from "@/redux/features/users/userApi";

// Import the new components
import DateSeparator from "./DateSeparator";
import MessageLoadingSkeleton from "./MessageLoadingSkeleton";
import { getDateGroupLabel, groupMessagesByDate } from "@/utils/dateGroup";
import MessageItem from "./MessageItemProps";

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

  // Group messages by date
  const groupedMessages = useMemo(() => {
    return groupMessagesByDate(allMessages);
  }, [allMessages]);

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
      className="w-full p-4 space-y-5 h-[calc(85vh-200px)] relative messages-box overflow-y-auto"
    >
      {messagesLoading ? (
        <MessageLoadingSkeleton />
      ) : (
        Object.keys(groupedMessages)
          .sort() // Sort dates chronologically
          .map((dateKey) => {
            const messagesForDate = groupedMessages[dateKey];
            console.log("Messages for date:", messagesForDate[0].createdAt);
            const dateLabel = getDateGroupLabel(messagesForDate[0].createdAt as Date);

            return (
              <div key={dateKey}>
                {/* Date Separator */}
                <DateSeparator label={dateLabel} />

                {/* Messages for this date */}
                <div className="space-y-3">
                  {messagesForDate.map((message: IMessage) => {
                    const isMyMessage = message?.senderId === user?._id;
                    return (
                      <MessageItem
                        key={message?._id}
                        message={message}
                        isMyMessage={isMyMessage}
                        receiverInfo={receiverInfo}
                        onOpenLightbox={openLightbox}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })
      )}

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