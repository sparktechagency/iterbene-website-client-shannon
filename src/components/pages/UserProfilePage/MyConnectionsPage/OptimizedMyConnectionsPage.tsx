"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useUnifiedTabs } from "@/hooks/useUnifiedTabs";
import SortSelector, { COMMON_SORT_OPTIONS } from "@/components/common/SortSelector";
import MyConnections from "./MyConnections/MyConnections";
import MyRequestConnections from "./MyRequestConnections/MyRequestConnections";

const OptimizedMyConnectionsPage = () => {
  const [sortBy, setSortBy] = useState<string>("createdAt");

  // Unified tab management
  const { activeTab, renderTabButtons } = useUnifiedTabs({
    tabs: [
      { key: "myConnections", label: "My Connections" },
      { key: "requests", label: "Requests" }
    ],
    defaultTab: "myConnections",
    onTabChange: () => {
      // Reset scroll position on tab change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Handle sort change
  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  // Memoized tab content to prevent unnecessary re-renders
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "myConnections":
        return (
          <MyConnections 
            activeTab={activeTab} 
            sortBy={sortBy} 
          />
        );
      case "requests":
        return (
          <MyRequestConnections 
            sortBy={sortBy} 
          />
        );
      default:
        return null;
    }
  }, [activeTab, sortBy]);

  return (
    <section className="w-full pb-20">
      {/* Header with tabs and sort selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-5">
        {renderTabButtons()}
        <SortSelector
          options={COMMON_SORT_OPTIONS.connections}
          value={sortBy}
          onChange={handleSortChange}
          placeholder="Sort By"
        />
      </div>

      {/* Content */}
      <div className="w-full">
        {tabContent}
      </div>
    </section>
  );
};

export default OptimizedMyConnectionsPage;