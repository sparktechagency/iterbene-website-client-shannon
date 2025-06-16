import React from 'react';
import Skeleton from "@/components/custom/custom-skeleton";
const MessageLoadingSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 7 }).map((_, index) => {
        const isMyMessage = index % 2 === 1; // Simulating sender/receiver alternation
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
            <Skeleton width="200px" height="55px" className="rounded-xl" />
          </div>
        );
      })}
    </>
  );
};

export default MessageLoadingSkeleton;