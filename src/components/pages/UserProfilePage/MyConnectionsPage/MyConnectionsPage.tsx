"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import MyConnections from "./MyConnections/MyConnections";
import MyRequestConnections from "./MyRequestConnections/MyRequestConnections";

const MyConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState<"myConnections" | "requests">(
    "myConnections"
  );
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    { value: "createdAt", label: "Recently Added" },
    { value: "-createdAt", label: "Oldest First" },
    { value: "fullName", label: "Name (A-Z)" },
    { value: "-fullName", label: "Name (Z-A)" },
  ];

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
        
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium">
              {sortOptions.find(option => option.value === sortBy)?.label || "Sort by"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                    sortBy === option.value ? "bg-primary/10 text-primary font-medium" : "text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="w-full">
        <div className={activeTab === "myConnections" ? "block" : "hidden"}>
          <MyConnections activeTab={activeTab} sortBy={sortBy} />
        </div>
        <div className={activeTab === "requests" ? "block" : "hidden"}>
          <MyRequestConnections sortBy={sortBy} />
        </div>
      </div>
    </section>
  );
};

export default MyConnectionsPage;
