"use client";
import React, { useState } from "react";
import MyInvitationsCard from "./MyInvitationsCard";
import { ChevronDown } from "lucide-react";
interface IAuthor {
  fullName: string;
  profileImage: {
    imageUrl: string;
  };
}

interface IEvent {
  id: number;
  title: string;
  author: IAuthor;
  image: {
    imageUrl: string;
  };
  members: string;
}
const MyInvitations = () => {
  const [activeTab, setActiveTab] = useState<string>("upcomingTour");
  const allMyInvitations: IEvent[] = [
    {
      id: 1,
      title: "Holiday trip to Barcelona Spain",
      author: {
        fullName: "John Doe",
        profileImage: {
          imageUrl:
            "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg",
        },
      },
      image: {
        imageUrl:
          "https://i.ibb.co.com/6RknjBzS/35b873adc5c444a2d66ee10e62d473d6.jpg",
      },
      members: "1.1K",
    },
    {
      id: 2,
      title: "Holiday trip to Barcelona Spain",
      author: {
        fullName: "John Doe",
        profileImage: {
          imageUrl:
            "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg",
        },
      },
      image: {
        imageUrl:
          "https://i.ibb.co.com/hFVGYMF0/2588a7b47b42d6dddfdfa08bb9300d00.jpg",
      },
      members: "1.1K",
    },
    {
      id: 3,
      title: "Holiday trip to Barcelona Spain",
      author: {
        fullName: "John Doe",
        profileImage: {
          imageUrl:
            "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg",
        },
      },
      image: {
        imageUrl:
          "https://i.ibb.co.com/JVfh3WK/36fe2823b98504660e2f44dc3c1ffb97.jpg",
      },
      members: "1.1K",
    },
    {
      id: 4,
      title: "Holiday trip to Barcelona Spain",
      author: {
        fullName: "John Doe",
        profileImage: {
          imageUrl:
            "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg",
        },
      },
      image: {
        imageUrl:
          "https://i.ibb.co.com/JVfh3WK/36fe2823b98504660e2f44dc3c1ffb97.jpg",
      },
      members: "1.1K",
    },
  ];
  return (
    <section className="w-full ">
      {/* Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
        <div className="flex space-x-4 ">
          <button
            onClick={() => setActiveTab("upcomingTour")}
            className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === "upcomingTour" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            Upcoming Tour
          </button>
          <button
            onClick={() => setActiveTab("invitation")}
            className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === "invitation" &&
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

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allMyInvitations.map((invitation) => (
          <MyInvitationsCard
            key={invitation.id}
            invitation={invitation}
            type={activeTab}
          />
        ))}
      </div>
    </section>
  );
};

export default MyInvitations;
