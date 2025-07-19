"use client";
import { useState } from "react";
import MyConnections from "./MyConnections/MyConnections";
import MyRequestConnections from "./MyRequestConnections/MyRequestConnections";

const MyConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState<"myConnections" | "requests">(
    "myConnections"
  );

  // Handle tab change
  const handleTabChange = (tab: "myConnections" | "requests") => {
    setActiveTab(tab);
  };

  return (
    <section className="w-full pb-20">
      {/* Tabs and Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-5">
        <div className="flex space-x-4">
          <button
            onClick={() => handleTabChange("myConnections")}
            className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === "myConnections" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            My Connections
          </button>
          <button
            onClick={() => handleTabChange("requests")}
            className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === "requests" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            Requests
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="w-full">
        <div className={activeTab === "myConnections" ? "block" : "hidden"}>
          <MyConnections activeTab={activeTab} />
        </div>
        <div className={activeTab === "requests" ? "block" : "hidden"}>
          <MyRequestConnections />
        </div>
      </div>
    </section>
  );
};

export default MyConnectionsPage;
