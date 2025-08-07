"use client";
import { useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import useUser from "@/hooks/useUser";
import { useGetSingleUserQuery } from "@/redux/features/users/userApi";
import Header from "@/components/common/header";
import MyProfileHeader from "./MyProfileHeader/MyProfileHeader";
import UserProfileHeader from "./UserProfileHeader/UserProfileHeader";
import UserProfileSkeleton from "./UserProfileSkeleton";
import NotFoundPage from "../not-found-page/not-found-page";

// Import all tab components
import UserTimeline from "./UserTimeline/UserTimeline";
import MyConnectionsPage from "./MyConnectionsPage/MyConnectionsPage";
import MyGroupsPage from "./MyGroupsPage/MyGroupsPage";
import UserIteItinerary from "./UserIteItinerary/UserIteItinerary";
import MyInvitationsPage from "./MyInvitationsPage/MyInvitationsPage";

type TabType = 'profile' | 'timeline' | 'connections' | 'groups' | 'videos' | 'photos' | 'maps' | 'itinerary' | 'invitations' | 'privacy';

interface TabConfig {
  name: string;
  key: TabType;
  component?: React.ComponentType;
}

const UserProfileWithTabs = () => {
  const user = useUser();
  const { userName } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const { data: responseData, isLoading } = useGetSingleUserQuery(
    { userName, ...(user && { userId: user?._id }) },
    {
      refetchOnMountOrArgChange: true,
      skip: !userName,
    }
  );

  const userData = responseData?.data?.attributes;
  const isMyProfile = user?._id === userData?._id;

  const myTabs: TabConfig[] = [
    { name: "Profile", key: "profile" },
    { name: "Timeline", key: "timeline", component: UserTimeline },
    { name: "Connections", key: "connections", component: MyConnectionsPage },
    { name: "Groups", key: "groups", component: MyGroupsPage },
    { name: "Videos", key: "videos" },
    { name: "Photos", key: "photos" },
    { name: "Maps", key: "maps" },
    { name: "Itinerary", key: "itinerary", component: UserIteItinerary },
    { name: "Invitations", key: "invitations", component: MyInvitationsPage },
    { name: "Privacy", key: "privacy" },
  ];

  const userTabs: TabConfig[] = [
    { name: "Profile", key: "profile" },
    { name: "Timeline", key: "timeline", component: UserTimeline },
    { name: "Videos", key: "videos" },
    { name: "Photos", key: "photos" },
    { name: "Itinerary", key: "itinerary", component: UserIteItinerary },
  ];

  const tabs = isMyProfile ? myTabs : userTabs;

  const handleTabChange = useCallback((tabKey: TabType) => {
    setActiveTab(tabKey);
  }, []);

  const renderTabContent = useMemo(() => {
    const currentTab = tabs.find(tab => tab.key === activeTab);
    
    if (activeTab === 'profile') {
      return (
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          <p className="text-gray-600">Profile content will go here...</p>
        </div>
      );
    }

    if (currentTab?.component) {
      const Component = currentTab.component;
      return <Component />;
    }

    return (
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{currentTab?.name}</h2>
        <p className="text-gray-600">This section is under development...</p>
      </div>
    );
  }, [activeTab, tabs]);

  if (isLoading) {
    return (
      <section className="w-full mx-auto">
        <Header />
        <div className="container mx-auto space-y-8 px-4 pb-10">
          <UserProfileSkeleton />
        </div>
      </section>
    );
  }

  if (!isLoading && !userData) {
    return <NotFoundPage />;
  }

  return (
    <section className="w-full mx-auto">
      <Header />
      <div className="container mx-auto space-y-8 px-4 pb-10">
        {isMyProfile ? (
          <MyProfileHeader userData={userData} />
        ) : (
          <UserProfileHeader userData={userData} />
        )}

        {/* Enhanced Tab Navigation */}
        <div className="bg-gray-100 border-gray-200 overflow-x-auto scrollbar-thin rounded-lg">
          <nav className="flex space-x-6 px-4 py-3">
            {tabs.map((tab) => (
              <div key={tab.key} className="relative">
                <motion.button
                  onClick={() => handleTabChange(tab.key)}
                  className={`text-sm font-medium pb-2 px-3 py-1 rounded-md transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.key
                      ? "text-primary bg-white shadow-sm"
                      : "text-gray-600 hover:text-primary hover:bg-white/50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.name}
                </motion.button>
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-[400px]"
        >
          {renderTabContent}
        </motion.div>
      </div>
    </section>
  );
};

export default UserProfileWithTabs;