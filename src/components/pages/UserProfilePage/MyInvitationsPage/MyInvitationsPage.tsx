"use client";
import { useState } from "react";
import MyUpComingTours from "./MyUpComingTours/MyUpComingTours";
import MyInvitations from "./MyInvitations/MyInvitations";
import CustomForm from "@/components/custom/custom-form";
import { FieldValues } from "react-hook-form";
import CustomSelectField from "@/components/custom/custom-seletectField";

const MyInvitationsPage = () => {
  const [sortBy, setSortBy] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"upcomingTour" | "invitation">(
    "upcomingTour"
  );

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    console.log("Sort By Changed:", value);
  };

  // Form submit handler
  const handleFormSubmit = (data: FieldValues) => {
    handleSortByChange(data.sortBy);
  };

  const selectItems = [
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
  ];

  return (
    <section className="w-full pb-20">
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

        {/* CustomForm দিয়ে wrap করা select field */}
        <div className="w-full max-w-40">
          <CustomForm onSubmit={handleFormSubmit}>
            <CustomSelectField
              items={selectItems}
              name="sortBy"
              fullWidth
              placeholder="Sort By"
            />
          </CustomForm>
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        {activeTab === "upcomingTour" ? (
          <MyUpComingTours sortBy={sortBy} />
        ) : (
          <MyInvitations sortBy={sortBy} />
        )}
      </div>
    </section>
  );
};

export default MyInvitationsPage;