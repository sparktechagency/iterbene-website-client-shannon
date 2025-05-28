"use client";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import MyConnections from "./MyConnections/MyConnections";
import MyRequestConnections from "./MyRequestConnections/MyRequestConnections";
const MyConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("My Connections");
  return (
    <section className="w-full pb-20">
      {/* Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
        <div className="flex space-x-4 ">
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
        <div className="px-4 py-2.5 border border-[#B5B7C5] rounded-xl font-semibold text-sm flex items-center gap-2 text-gray-900">
          <span className="font-medium">Recently</span>
          <ChevronDown size={24} />
        </div>
      </div>
      {/* Content */}
      {activeTab === "My Connections" ? (
        <MyConnections />
      ) : (
        <MyRequestConnections />
      )}
    </section>
  );
};

export default MyConnectionsPage;
