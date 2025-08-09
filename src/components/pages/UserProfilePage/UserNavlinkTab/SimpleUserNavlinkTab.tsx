"use client";
import { motion } from "framer-motion";
interface SimpleUserNavlinkTabProps {
  isMyProfile: boolean;
  onTabChange?: (tabKey: string) => void;
  activeTab?: string;
}

const SimpleUserNavlinkTab = ({ 
  isMyProfile, 
  onTabChange,
  activeTab 
}: SimpleUserNavlinkTabProps) => {

  const myTabs = [
    { name: "Profile", key: "profile" },
    { name: "Timeline", key: "timeline" },
    { name: "Connections", key: "connections" },
    { name: "Groups", key: "groups" },
    { name: "Videos", key: "videos" },
    { name: "Photos", key: "photos" },
    { name: "Maps", key: "maps" },
    { name: "Itinerary", key: "itinerary" },
    { name: "Invitations", key: "invitations" },
    { name: "Privacy", key: "privacy" },
  ];

  const userTabs = [
    { name: "Profile", key: "profile" },
    { name: "Timeline", key: "timeline" },
    { name: "Videos", key: "videos" },
    { name: "Photos", key: "photos" },
    { name: "Itinerary", key: "itinerary" },
  ];

  const tabs = isMyProfile ? myTabs : userTabs;

  const handleTabClick = (tabKey: string) => {
    if (onTabChange) {
      onTabChange(tabKey);
    }
  };

  return (
    <div className="bg-gray-100 border-gray-200 overflow-x-auto scrollbar-thin">
      <nav className="flex space-x-6 px-4 py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          
          return (
            <div key={tab.name} className="relative">
              <button
                onClick={() => handleTabClick(tab.key)}
                className={`text-sm font-medium pb-2 transition-colors duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {tab.name}
              </button>
              {isActive && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default SimpleUserNavlinkTab;