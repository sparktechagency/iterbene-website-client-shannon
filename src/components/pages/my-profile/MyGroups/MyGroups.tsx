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

  // Updated groups array with unique names and images
  const groups: IGroup[] = [
    {
      name: "Adventure Seekers",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop", // Beach adventure
      isPublic: true,
      members: "1.1K",
    },
    {
      name: "City Explorers",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2000&auto=format&fit=crop", // Cityscape (NYC)
      isPublic: true,
      members: "1.1K",
    },
    {
      name: "Nature Lovers Hub",
      image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=2000&auto=format&fit=crop", // Forest
      isPublic: true,
      members: "1.1K",
    },
    {
      name: "Foodie Travelers",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2000&auto=format&fit=crop", // Food market
      isPublic: true,
      members: "1.1K",
    },
    {
      name: "Cultural Enthusiasts",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2000&auto=format&fit=crop", // Colosseum (Rome)
      isPublic: true,
      members: "1.1K",
    },
    {
      name: "Mountain Hikers",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2000&auto=format&fit=crop", // Mountains
      isPublic: true,
      members: "1.1K",
    },
    {
      name: "Photography Club",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2000&auto=format&fit=crop", // Photographer in nature
      isPublic: true,
      members: "1.1K",
    },
    {
      name: "Beach Bums",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop", // Beach (reused for theme)
      isPublic: true,
      members: "1.1K",
    },
    {
      name: "Urban Adventurers",
      image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=2000&auto=format&fit=crop", // City skyline
      isPublic: true,
      members: "1.1K",
    },
    {
      name: "Wildlife Watchers",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2000&auto=format&fit=crop", // Wildlife
      isPublic: true,
      members: "1.1K",
    },
    {
      name: "History Buffs",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2000&auto=format&fit=crop", // Historical site (Trevi Fountain)
      isPublic: true,
      members: "1.1K",
    },
    {
      name: "Solo Travelers",
      image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=2000&auto=format&fit=crop", // Solo traveler
      isPublic: true,
      members: "1.1K",
    },
    {
      name: "Art & Culture Group",
      image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=2000&auto=format&fit=crop", // Cultural landmark (reused)
      isPublic: true,
      members: "1.1K",
    },
    {
      name: "Backpackers United",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2000&auto=format&fit=crop", // Backpacker
      isPublic: true,
      members: "1.1K",
    },
  ];

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
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group, index) => (
          <MyGroupCard key={index} group={group} />
        ))}
      </div>
    </div>
  );
};

export default MyGroups;