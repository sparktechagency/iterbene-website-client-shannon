import React from "react";
import ChatCard from "./chat-card";
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
];

const Chats = () => {
  return (
    <div className="w-full bg-white p-[42px] rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Chats</h2>
      <div className="space-y-6">
        {demoChats.map((chat, index) => (
          <ChatCard key={index} chat={chat} />
        ))}
      </div>
    </div>
  );
};

export default Chats;
