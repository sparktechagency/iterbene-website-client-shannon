"use client";
import React, { useState } from "react";
import MyGroupCard from "./MyGroupCard";
import { ChevronDown } from "lucide-react";

// Define types for connection data
export interface IGroup {
  name: string;
  image: string;
  isPublic: boolean;
  members: string;
}

const MyGroups: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("myGroups");

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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
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
        <div className="px-4 py-2.5 border border-[#B5B7C5] rounded-xl font-semibold text-sm flex items-center gap-2 text-gray-900">
          <span className="font-medium">Recently</span>
          <ChevronDown size={24} />
        </div>
      </div>
      {/* Connections List */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-7">
        {groups.map((group, index) => (
          <MyGroupCard key={index} group={group} />
        ))}
      </div>
    </div>
  );
};

export default MyGroups;
