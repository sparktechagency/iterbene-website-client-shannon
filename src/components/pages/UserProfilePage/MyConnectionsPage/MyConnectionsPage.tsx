"use client";
import React, { useState } from "react";
import MyConnections from "./MyConnections/MyConnections";
import MyRequestConnections from "./MyRequestConnections/MyRequestConnections";
import SelectField from "@/components/custom/SelectField";
const MyConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("My Connections");
  const [sortBy, setSortBy] = useState<string>("");

  return (
    <section className="w-full pb-20">
      {/* Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
        <div className="w-full flex space-x-4">
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
        <div className="w-full max-w-40">
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
        </div>
      </div>
      {/* Content */}
      {activeTab === "My Connections" ? (
        <MyConnections sortBy={sortBy} />
      ) : (
        <MyRequestConnections sortBy={sortBy} />
      )}
    </section>
  );
};

export default MyConnectionsPage;
