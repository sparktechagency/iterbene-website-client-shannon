"use client";
import React, { useState } from "react";
import MyConnectionCard from "./MyConnectionCard";

// Define types for connection data
interface Connection {
  name: string;
  image: string;
  isRequest: boolean;
}

const MyConnections: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("My Connections");
  const [sortOption, setSortOption] = useState<string>("Recently Active");

  // Mock data for connections (replace with real data in a real app)
  const connections: Connection[] = Array(14).fill({
    name: "Alexandra Brooke",
    image: "https://randomuser.me/api/portraits/women/1.jpg", 
    isRequest: false
  });

  return (
    <div className="w-full mx-auto">
      {/* Tabs */}
      <div className="flex items-center justify-between pb-5">
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
      <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="Alphabetical">Alphabetical</option>
            <option value="Recently Active">Recently Active</option>
            <option value="Newest Members">Newest Members</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Connections List */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-7">
        {connections.map((connection, index) => (
          <MyConnectionCard key={index} connection={connection}   />
        ))}
      </div>
    </div>
  );
};

export default MyConnections;
