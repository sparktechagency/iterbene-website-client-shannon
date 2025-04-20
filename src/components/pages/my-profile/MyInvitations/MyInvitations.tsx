"use client";
import React, { useState } from "react";
import MyInvitationsCard from "./MyInvitationsCard";
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
  const [sortOption, setSortOption] = useState<string>("Recently Active");
  const allMyInvitations : IEvent[] = [
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
      <div className="flex items-center justify-between pb-5">
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

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allMyInvitations.map((invitation) => (
          <MyInvitationsCard key={invitation.id} invitation={invitation} type={activeTab} />
        ))}
      </div>
    </section>
  );
};

export default MyInvitations;
