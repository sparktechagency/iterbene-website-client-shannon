"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import MyJoinedGroups from "./MyJoinedGroups/MyJoinedGroups";
import MyInvitationsGroups from "./MyInvitationsGroup/MyInvitationsGroups";

const MyGroupsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("myGroups");

  return (
    <div>
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
      {/* Content */}
      <div className="w-full">
        {activeTab === "myGroups" ? (
          <MyJoinedGroups />
        ) : (
          <MyInvitationsGroups />
        )}
      </div>
    </div>
  );
};

export default MyGroupsPage;
