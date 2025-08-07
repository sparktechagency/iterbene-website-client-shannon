import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type TabType = 'profile' | 'timeline' | 'connections' | 'groups' | 'videos' | 'photos' | 'maps' | 'itinerary' | 'invitations' | 'privacy';

interface UseTabNavigationProps {
  userName: string;
  initialTab?: TabType;
  updateURL?: boolean;
}

interface TabConfig {
  name: string;
  key: TabType;
  path: string;
}

export const useTabNavigation = ({ 
  userName, 
  initialTab = 'profile',
  updateURL = false 
}: UseTabNavigationProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [loadedTabs, setLoadedTabs] = useState<Set<TabType>>(new Set([initialTab]));
  const router = useRouter();

  const myTabs: TabConfig[] = [
    { name: "Profile", key: "profile", path: `/${userName}` },
    { name: "Timeline", key: "timeline", path: `/${userName}/timeline` },
    { name: "Connections", key: "connections", path: `/${userName}/connections` },
    { name: "Groups", key: "groups", path: `/${userName}/groups` },
    { name: "Videos", key: "videos", path: `/${userName}/videos` },
    { name: "Photos", key: "photos", path: `/${userName}/photos` },
    { name: "Maps", key: "maps", path: `/${userName}/maps` },
    { name: "Itinerary", key: "itinerary", path: `/${userName}/itinerary` },
    { name: "Invitations", key: "invitations", path: `/${userName}/invitations` },
    { name: "Privacy", key: "privacy", path: `/${userName}/privacy` },
  ];

  const userTabs: TabConfig[] = [
    { name: "Profile", key: "profile", path: `/${userName}` },
    { name: "Timeline", key: "timeline", path: `/${userName}/timeline` },
    { name: "Videos", key: "videos", path: `/${userName}/videos` },
    { name: "Photos", key: "photos", path: `/${userName}/photos` },
    { name: "Itinerary", key: "itinerary", path: `/${userName}/itinerary` },
  ];

  const changeTab = useCallback((tabKey: TabType) => {
    setActiveTab(tabKey);
    setLoadedTabs(prev => new Set([...prev, tabKey]));
    
    if (updateURL) {
      const tab = [...myTabs, ...userTabs].find(t => t.key === tabKey);
      if (tab) {
        // Use shallow routing to avoid full page reload
        router.push(tab.path, { scroll: false });
      }
    }
  }, [userName, updateURL, router, myTabs, userTabs]);

  const preloadTab = useCallback((tabKey: TabType) => {
    setLoadedTabs(prev => new Set([...prev, tabKey]));
  }, []);

  // Initialize tab from URL if needed
  useEffect(() => {
    if (typeof window !== 'undefined' && updateURL) {
      const path = window.location.pathname;
      const currentTab = [...myTabs, ...userTabs].find(tab => tab.path === path);
      if (currentTab && currentTab.key !== activeTab) {
        setActiveTab(currentTab.key);
        setLoadedTabs(prev => new Set([...prev, currentTab.key]));
      }
    }
  }, [userName, updateURL, myTabs, userTabs, activeTab]);

  return {
    activeTab,
    loadedTabs,
    changeTab,
    preloadTab,
    myTabs,
    userTabs,
  };
};