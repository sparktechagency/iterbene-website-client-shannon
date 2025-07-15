"use client";
import { useState } from "react";
import MyJoinedGroups from "./MyJoinedGroups/MyJoinedGroups";
import MyInvitationsGroups from "./MyInvitationsGroup/MyInvitationsGroups";
// import SelectField from "@/components/custom/SelectField";

const MyGroupsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("myGroups");
  // const [sortBy, setSortBy] = useState<string>("");

  return (
    <section className="w-full pb-20">
      {/* Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
        <div className="flex space-x-4 ">
          <button
            onClick={() => setActiveTab("myGroups")}
            className={`px-9 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
              activeTab === "myGroups" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            My Group
          </button>
          <button
            onClick={() => setActiveTab("invitations")}
            className={`px-9 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
              activeTab === "invitations" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            Invitations
          </button>
        </div>
        {/* <div className="w-full max-w-40">
          <SelectField
            items={[
              {
                label: "Recently",
                value: "createdAt",
              },
              {
                label: "Name (A-Z)",
                value: "nameAsc",
              },
              {
                label: "Name (Z-A)",
                value: "nameDesc",
              },
              {
                label: "Oldest First",
                value: "-createdAt",
              },
            ]}
            name="sortBy"
            fullWidth
            value={sortBy}
            placeholder="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div> */}
      </div>
      {/* Content */}
      <div className="w-full">
        {activeTab === "myGroups" ? (
          <MyJoinedGroups />
        ) : (
          <MyInvitationsGroups />
        )}
      </div>
    </section>
  );
};

export default MyGroupsPage;
