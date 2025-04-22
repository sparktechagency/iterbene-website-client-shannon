'use client';
import React from "react";
import ChatCard from "./chat-card";
import { useParams } from "next/navigation";
// Define the IChat interface
interface IChat {
  _id: number;
  userName: string;
  profileImage: string;
  lastMessage: string;
  timeStamp: string;
}

// Demo data
const demoChats: IChat[] = [
  {
    _id: 1,
    userName: "Alice Johnson",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
    lastMessage: "Hey, how's it going?",
    timeStamp: "10:30 AM",
  },
  {
    _id: 2,
    userName: "Bob Smith",
    profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
    lastMessage: "Can we meet tomorrow?",
    timeStamp: "9:15 AM",
  },
  {
    _id: 3,
    userName: "Clara Williams",
    profileImage: "https://randomuser.me/api/portraits/women/3.jpg",
    lastMessage: "Thanks for the update!",
    timeStamp: "Yesterday",
  },
  {
    _id: 4,
    userName: "David Brown",
    profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
    lastMessage: "I'll send the files soon.",
    timeStamp: "Monday",
  },
  {
    _id: 5,
    userName: "Alice Johnson",
    profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
    lastMessage: "I'll send the files soon.",
    timeStamp: "Monday",
  },
];

const Chats = () => {
    const {chatId} = useParams()
  return (
    <div className={`"w-full" ${chatId && "hidden md:block"}`}>
      <div className="mb-6">
        <input
          type="text"
          name="search"
          className="w-full py-3 px-4 border border-[#CCC0DB] rounded-2xl"
          placeholder="Search"
        />
      </div>
      <div className="space-y-6">
        {demoChats.map((chat, index) => (
          <ChatCard key={index} chat={chat} />
        ))}
      </div>
    </div>
  );
};

export default Chats;
