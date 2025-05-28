"use client";

import { useState } from "react";
import MyUpComingTours from "./MyUpComingTours/MyUpComingTours";
import MyInvitations from "./MyInvitations/MyInvitations";
import { ChevronDown } from "lucide-react";

const MyInvitationsPage = () => {
  const [activeTab, setActiveTab] = useState<"upcomingTour" | "invitation">(
    "upcomingTour"
  );
  return (
    <section>
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
      {/* Content */}
      <div className="w-full">
        {activeTab === "upcomingTour" ? <MyUpComingTours /> : <MyInvitations />}
      </div>
    </section>
  );
};

export default MyInvitationsPage;
