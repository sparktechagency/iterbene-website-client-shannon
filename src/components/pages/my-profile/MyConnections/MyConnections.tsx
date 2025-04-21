"use client";
import React, { useState } from "react";
import MyConnectionCard from "./MyConnectionCard";
import { ChevronDown } from "lucide-react";

// Define types for connection data
interface Connection {
  name: string;
  image: string;
  isRequest: boolean;
}

const MyConnections: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("My Connections");

  // Updated connections array with unique names and images
  const connections: Connection[] = [
    { name: "Mia Reynolds", image: "https://randomuser.me/api/portraits/women/25.jpg", isRequest: false },
    { name: "James Carter", image: "https://randomuser.me/api/portraits/men/26.jpg", isRequest: false },
    { name: "Ella Harper", image: "https://randomuser.me/api/portraits/women/27.jpg", isRequest: false },
    { name: "Logan Evans", image: "https://randomuser.me/api/portraits/men/28.jpg", isRequest: false },
    { name: "Chloe Bennett", image: "https://randomuser.me/api/portraits/women/29.jpg", isRequest: false },
    { name: "Ryan Foster", image: "https://randomuser.me/api/portraits/men/30.jpg", isRequest: false },
    { name: "Grace Kim", image: "https://randomuser.me/api/portraits/women/31.jpg", isRequest: false },
    { name: "Mason Lee", image: "https://randomuser.me/api/portraits/men/32.jpg", isRequest: false },
    { name: "Zoe Patel", image: "https://randomuser.me/api/portraits/women/33.jpg", isRequest: false },
    { name: "Ethan Brooks", image: "https://randomuser.me/api/portraits/men/34.jpg", isRequest: false },
    { name: "Lydia Nguyen", image: "https://randomuser.me/api/portraits/women/35.jpg", isRequest: false },
    { name: "Caleb Hayes", image: "https://randomuser.me/api/portraits/men/36.jpg", isRequest: false },
    { name: "Aria Sullivan", image: "https://randomuser.me/api/portraits/women/37.jpg", isRequest: false },
    { name: "Owen Mitchell", image: "https://randomuser.me/api/portraits/men/38.jpg", isRequest: false },
  ];

  return (
    <div className="w-full mx-auto">
      {/* Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
        <div className="flex space-x-4 ">
          <button
            onClick={() => setActiveTab("My Connections")}
            className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === "My Connections" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            My Connections
          </button>
          <button
            onClick={() => setActiveTab("Requests")}
            className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === "Requests" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            Requests
          </button>
        </div>
        <div className="px-4 py-2.5 border border-[#B5B7C5] rounded-xl font-semibold text-sm flex items-center gap-2 text-gray-900">
          <span className="font-medium">Recently</span>
          <ChevronDown size={24} />
        </div>
      </div>

      {/* Connections List */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-7">
        {connections.map((connection, index) => (
          <MyConnectionCard key={index} connection={connection} />
        ))}
      </div>
    </div>
  );
};

export default MyConnections;