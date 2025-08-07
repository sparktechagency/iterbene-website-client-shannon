"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

// Import RTK Query hooks for prefetching
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useGetMyConnectionsQuery } from "@/redux/features/connections/connectionsApi";
import { useGetMyJoinedGroupsQuery } from "@/redux/features/group/groupApi";
import { useGetSavedPostQuery } from "@/redux/features/savedPost/savedPost.api";

type TabType = 'profile' | 'timeline' | 'connections' | 'groups' | 'videos' | 'photos' | 'maps' | 'itinerary' | 'invitations' | 'privacy';

interface TabConfig {
  name: string;
  key: TabType;
  component?: React.ComponentType;
  prefetch?: boolean;
}

const OptimizedUserProfile = () => {
  const user = useUser();
  const { userName } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loadedTabs, setLoadedTabs] = useState<Set<TabType>>(new Set(['profile']));

  const username = typeof userName === "string" ? userName : Array.isArray(userName) ? userName[0] : "";

  const { data: responseData, isLoading } = useGetSingleUserQuery(
    { userName, ...(user && { userId: user?._id }) },
    {
      refetchOnMountOrArgChange: true,
      skip: !userName,
    }
  );

  const userData = responseData?.data?.attributes;
  const isMyProfile = user?._id === userData?._id;

  // Prefetch data for frequently accessed tabs
  const timelinePrefetch = useGetUserTimelinePostsQuery(
    {
      username,
      filters: [
        { key: "page", value: "1" },
        { key: "limit", value: "9" },
        { key: "sortBy", value: "createdAt" },
      ],
    },
    { 
      skip: !username || !userData,
      refetchOnMountOrArgChange: false,
    }
  );

  const connectionsPrefetch = useGetMyConnectionsQuery(
    [
      { key: "page", value: "1" },
      { key: "limit", value: "6" },
      { key: "sortBy", value: "createdAt" },
    ],
    {
      skip: !isMyProfile,
      refetchOnMountOrArgChange: false,
    }
  );

  const groupsPrefetch = useGetMyJoinedGroupsQuery(
    [
      { key: "page", value: "1" },
      { key: "limit", value: "9" },
      { key: "sortBy", value: "createdAt" },
    ],
    {
      skip: !isMyProfile,
      refetchOnMountOrArgChange: false,
    }
  );

  const myTabs: TabConfig[] = [
    { name: "Profile", key: "profile" },
    { name: "Timeline", key: "timeline", component: UserTimeline, prefetch: true },
    { name: "Connections", key: "connections", component: MyConnectionsPage, prefetch: true },
    { name: "Groups", key: "groups", component: MyGroupsPage, prefetch: true },
    { name: "Videos", key: "videos" },
    { name: "Photos", key: "photos" },
    { name: "Maps", key: "maps" },
    { name: "Itinerary", key: "itinerary", component: UserIteItinerary },
    { name: "Invitations", key: "invitations", component: MyInvitationsPage },
    { name: "Privacy", key: "privacy" },
  ];

  const userTabs: TabConfig[] = [
    { name: "Profile", key: "profile" },
    { name: "Timeline", key: "timeline", component: UserTimeline, prefetch: true },
    { name: "Videos", key: "videos" },
    { name: "Photos", key: "photos" },
    { name: "Itinerary", key: "itinerary", component: UserIteItinerary },
  ];

  const tabs = isMyProfile ? myTabs : userTabs;

  const handleTabChange = useCallback((tabKey: TabType) => {
    setActiveTab(tabKey);
    setLoadedTabs(prev => new Set([...prev, tabKey]));
  }, []);

  // Preload next likely tabs on hover
  const handleTabHover = useCallback((tabKey: TabType) => {
    if (!loadedTabs.has(tabKey)) {
      setLoadedTabs(prev => new Set([...prev, tabKey]));
    }
  }, [loadedTabs]);

  const TabWrapper = ({ children, tabKey }: { children: React.ReactNode, tabKey: TabType }) => {
    const shouldRender = loadedTabs.has(tabKey);
    const isActive = activeTab === tabKey;

    if (!shouldRender) return null;

    return (
      <div 
        className={`${isActive ? 'block' : 'hidden'}`}
        style={{ display: isActive ? 'block' : 'none' }}
      >
        {children}
      </div>
    );
  };

  const renderTabContent = useMemo(() => {
    const currentTab = tabs.find(tab => tab.key === activeTab);
    
    if (activeTab === 'profile') {
      return (
        <motion.div
          key="profile"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              <span className="font-semibold">Full Name:</span> {userData?.fullName || 'N/A'}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Username:</span> {userData?.userName || 'N/A'}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {userData?.email || 'N/A'}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Bio:</span> {userData?.bio || 'No bio available'}
            </p>
          </div>
        </motion.div>
      );
    }

    return (
      <>
        {tabs.map(tab => (
          <TabWrapper key={tab.key} tabKey={tab.key}>
            {tab.component ? (
              <tab.component />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h2 className="text-2xl font-bold mb-4">{tab.name}</h2>
                <p className="text-gray-600">This section is under development...</p>
              </motion.div>
            )}
          </TabWrapper>
        ))}
      </>
    );
  }, [tabs, activeTab, userData, loadedTabs]);

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

        {/* Enhanced Tab Navigation with Performance Optimizations */}
        <div className="bg-white border border-gray-200 overflow-x-auto scrollbar-thin rounded-lg shadow-sm">
          <nav className="flex space-x-2 px-4 py-3">
            {tabs.map((tab) => (
              <div key={tab.key} className="relative">
                <motion.button
                  onClick={() => handleTabChange(tab.key)}
                  onMouseEnter={() => handleTabHover(tab.key)}
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 whitespace-nowrap relative ${
                    activeTab === tab.key
                      ? "text-primary bg-primary/5 shadow-sm border border-primary/20"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab.name}
                  {/* Loading indicator for prefetching */}
                  {tab.prefetch && !loadedTabs.has(tab.key) && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  )}
                </motion.button>
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Optimized Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="min-h-[400px]"
          >
            {renderTabContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default OptimizedUserProfile;