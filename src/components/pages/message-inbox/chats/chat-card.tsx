import Image from "next/image";
import React from "react";

interface IChat {
  _id: number;
  userName: string;
  profileImage: string;
  lastMessage: string;
  timeStamp: string;
}
interface IChatCardProps {
  chat: IChat;
}

const ChatCard = ({ chat }: IChatCardProps) => {
  return (
    <div
      className={`w-full flex items-center justify-between p-4 border  rounded-2xl ${
        chat._id === 1
          ? "bg-[#C4F5F0] border-[#C4F5F0]"
          : "bg-white border-[#CCC0DB]"
      }`}
    >
      <div className="flex items-center gap-3">
        <Image
          src={chat.profileImage}
          alt={chat.userName}
          width={70}
          height={70}
          className="size-[70px] rounded-full object-cover flex-shrink-0"
        />
        <div>
          <h1 className="text-[18px] font-medium">{chat.userName}</h1>
          <p className="text-[16px] text-gray-600">{chat.lastMessage}</p>
        </div>
      </div>
      <p>{chat.timeStamp}</p>
    </div>
  );
};

export default ChatCard;
