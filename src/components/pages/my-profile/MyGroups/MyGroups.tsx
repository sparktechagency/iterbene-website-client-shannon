"use client";
import React, { useState } from "react";
import MyGroupCard from "./MyGroupCard";

// Define types for connection data
export interface IGroup {
  name: string;
  image: string;
  isPublic: boolean;
  members: string;
}

const MyGroups: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("myGroups");
  const [sortOption, setSortOption] = useState<string>("Recently Active");

  // Mock data for connections (replace with real data in a real app)
  const groups: IGroup[] = Array(14).fill({
    name: "World Trip Community",
    image: "https://randomuser.me/api/portraits/women/1.jpg", 
    isPublic: true,
    members: "1.1K",
  });

  return (
    <div className="w-full mx-auto">
      {/* Tabs */}
      <div className="flex space-x-4 ">
        <button
          onClick={() => setActiveTab("myGroups")}
          className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
            activeTab === "myGroups" &&
            "bg-[#E9F8F9] border border-primary text-primary"
          }`}
        >
          My Group
        </button>
        <button
          onClick={() => setActiveTab("invitations")}
          className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
            activeTab === "invitations" &&
            "bg-[#E9F8F9] border border-primary text-primary"
          }`}
        >
          Invitations
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="flex justify-end mb-4">
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
        {groups.map((group, index) => (
          <MyGroupCard key={index} group={group}   />
        ))}
      </div>
    </div>
  );
};

export default MyGroups;
