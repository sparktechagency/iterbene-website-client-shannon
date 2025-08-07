"use client";
import { useState, useCallback, useMemo, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useUser from "@/hooks/useUser";
import { useGetSingleUserQuery } from "@/redux/features/users/userApi";
import Header from "@/components/common/header";
import MyProfileHeader from "./MyProfileHeader/MyProfileHeader";
import UserProfileHeader from "./UserProfileHeader/UserProfileHeader";
import UserProfileSkeleton from "./UserProfileSkeleton";
import NotFoundPage from "../not-found-page/not-found-page";

// Lazy load components for better performance
import { lazy } from "react";
const UserTimeline = lazy(() => import("./UserTimeline/UserTimeline"));
const MyConnectionsPage = lazy(() => import("./MyConnectionsPage/MyConnectionsPage"));
const MyGroupsPage = lazy(() => import("./MyGroupsPage/MyGroupsPage"));
const UserIteItinerary = lazy(() => import("./UserIteItinerary/UserIteItinerary"));
const MyInvitationsPage = lazy(() => import("./MyInvitationsPage/MyInvitationsPage"));

type TabType = 'profile' | 'timeline' | 'connections' | 'groups' | 'videos' | 'photos' | 'maps' | 'itinerary' | 'invitations' | 'privacy';

interface TabConfig {
  name: string;
  key: TabType;
  component?: React.ComponentType;
  icon?: string;
}

// Loading component for lazy loaded tabs
const TabLoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-primary/40 rounded-full animate-spin animate-reverse"></div>
    </div>
  </div>
);

const ImprovedUserProfilePage = () => {
  const user = useUser();
  const { userName } = useParams();
  const searchParams = useSearchParams();
  
  // Get initial tab from URL params or default to profile
  const initialTab = (searchParams?.get('tab') as TabType) || 'profile';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [loadedTabs, setLoadedTabs] = useState<Set<TabType>>(new Set([initialTab]));

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
    { name: "Profile", key: "profile", icon: "👤" },
    { name: "Timeline", key: "timeline", component: UserTimeline, icon: "📰" },
    { name: "Connections", key: "connections", component: MyConnectionsPage, icon: "👥" },
    { name: "Groups", key: "groups", component: MyGroupsPage, icon: "👥" },
    { name: "Videos", key: "videos", icon: "🎥" },
    { name: "Photos", key: "photos", icon: "📸" },
    { name: "Maps", key: "maps", icon: "🗺️" },
    { name: "Itinerary", key: "itinerary", component: UserIteItinerary, icon: "✈️" },
    { name: "Invitations", key: "invitations", component: MyInvitationsPage, icon: "💌" },
    { name: "Privacy", key: "privacy", icon: "🔒" },
  ];

  const userTabs: TabConfig[] = [
    { name: "Profile", key: "profile", icon: "👤" },
    { name: "Timeline", key: "timeline", component: UserTimeline, icon: "📰" },
    { name: "Videos", key: "videos", icon: "🎥" },
    { name: "Photos", key: "photos", icon: "📸" },
    { name: "Itinerary", key: "itinerary", component: UserIteItinerary, icon: "✈️" },
  ];

  const tabs = isMyProfile ? myTabs : userTabs;

  const handleTabChange = useCallback((tabKey: TabType) => {
    setActiveTab(tabKey);
    setLoadedTabs(prev => new Set([...prev, tabKey]));
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabKey);
    window.history.replaceState(null, '', url.toString());
  }, []);

  const handleTabHover = useCallback((tabKey: TabType) => {
    // Preload tab component on hover for instant switching
    if (!loadedTabs.has(tabKey)) {
      setTimeout(() => {
        setLoadedTabs(prev => new Set([...prev, tabKey]));
      }, 300); // Small delay to avoid unnecessary preloading
    }
  }, [loadedTabs]);

  const renderTabContent = useMemo(() => {
    if (activeTab === 'profile') {
      return (
        <motion.div
          key="profile-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">👤</div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Profile Information</h2>
              <p className="text-gray-600">Complete user details and information</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-lg font-semibold text-gray-800">{userData?.fullName || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-500">Username</label>
                <p className="text-lg font-semibold text-gray-800">@{userData?.userName || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg font-semibold text-gray-800">{userData?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-500">Bio</label>
                <p className="text-gray-700">{userData?.bio || 'No bio available'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="text-lg font-semibold text-gray-800">
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    const currentTab = tabs.find(tab => tab.key === activeTab);
    
    if (currentTab?.component && loadedTabs.has(activeTab)) {
      const Component = currentTab.component;
      return (
        <Suspense fallback={<TabLoadingSpinner />}>
          <Component />
        </Suspense>
      );
    }

    // Under development placeholder
    return (
      <motion.div
        key={`${activeTab}-placeholder`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center"
      >
        <div className="text-6xl mb-4">{currentTab?.icon || '🚧'}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentTab?.name}</h2>
        <p className="text-gray-600 mb-8">This section is under development...</p>
        <div className="inline-block px-6 py-3 bg-primary/10 text-primary rounded-lg">
          Coming Soon
        </div>
      </motion.div>
    );
  }, [activeTab, tabs, userData, loadedTabs]);

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
    <section className="w-full mx-auto bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto space-y-6 px-4 pb-10">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm">
          {isMyProfile ? (
            <MyProfileHeader userData={userData} />
          ) : (
            <UserProfileHeader userData={userData} />
          )}
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <nav className="flex overflow-x-auto scrollbar-thin p-2 gap-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                onMouseEnter={() => handleTabHover(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap font-medium transition-all duration-200 relative ${
                  activeTab === tab.key
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={false}
                animate={{\n                  boxShadow: activeTab === tab.key ? \n                    \"0 4px 12px rgba(0,0,0,0.1)\" : \n                    \"0 0px 0px rgba(0,0,0,0)\"\n                }}
              >
                <span className="text-lg">{tab.icon}</span>\n                <span>{tab.name}</span>\n                \n                {/* Loading indicator */}\n                {loadedTabs.has(tab.key) && activeTab !== tab.key && (\n                  <motion.div\n                    className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"\n                    initial={{ scale: 0 }}\n                    animate={{ scale: 1 }}\n                    transition={{ delay: 0.2 }}\n                  />\n                )}\n                \n                {/* Active indicator */}\n                {activeTab === tab.key && (\n                  <motion.div\n                    layoutId="activeTabBg"\n                    className="absolute inset-0 bg-primary rounded-lg -z-10"\n                    initial={false}\n                    transition={{ type: "spring", stiffness: 300, damping: 30 }}\n                  />\n                )}\n              </motion.button>\n            ))}\n          </nav>\n        </div>\n\n        {/* Optimized Tab Content with AnimatePresence */}\n        <AnimatePresence mode="wait">\n          <motion.div\n            key={activeTab}\n            initial={{ opacity: 0, y: 20 }}\n            animate={{ opacity: 1, y: 0 }}\n            exit={{ opacity: 0, y: -20 }}\n            transition={{ duration: 0.2 }}\n            className="min-h-[500px]"\n          >\n            {renderTabContent}\n          </motion.div>\n        </AnimatePresence>\n      </div>\n    </section>\n  );\n};\n\nexport default ImprovedUserProfilePage;