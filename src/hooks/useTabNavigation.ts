import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

type TabType =
  | "profile"
  | "timeline"
  | "connections"
  | "groups"
  | "videos"
  | "photos"
  | "maps"
  | "itinerary"
  | "invitations"
  | "privacy";

interface UseTabNavigationProps {
  userName: string;
  initialTab?: TabType;
  updateURL?: boolean;
}

export const useTabNavigation = ({
  userName,
  initialTab = "profile",
  updateURL = false,
}: UseTabNavigationProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [loadedTabs, setLoadedTabs] = useState<Set<TabType>>(
    new Set([initialTab])
  );
  const router = useRouter();

  const myTabs = useMemo(() => {
    return [
      { name: "Profile", key: "profile", path: `/${userName}` },
      { name: "Timeline", key: "timeline", path: `/${userName}/timeline` },
      {
        name: "Connections",
        key: "connections",
        path: `/${userName}/connections`,
      },
      { name: "Groups", key: "groups", path: `/${userName}/groups` },
      { name: "Videos", key: "videos", path: `/${userName}/videos` },
      { name: "Photos", key: "photos", path: `/${userName}/photos` },
      { name: "Maps", key: "maps", path: `/${userName}/maps` },
      { name: "Itinerary", key: "itinerary", path: `/${userName}/itinerary` },
      {
        name: "Invitations",
        key: "invitations",
        path: `/${userName}/invitations`,
      },
      { name: "Privacy", key: "privacy", path: `/${userName}/privacy` },
    ];
  }, [userName]);

  const userTabs = useMemo(() => {
    return [
      { name: "Profile", key: "profile", path: `/${userName}` },
      { name: "Timeline", key: "timeline", path: `/${userName}/timeline` },
      { name: "Videos", key: "videos", path: `/${userName}/videos` },
      { name: "Photos", key: "photos", path: `/${userName}/photos` },
      { name: "Itinerary", key: "itinerary", path: `/${userName}/itinerary` },
    ];
  }, [userName]);

  const changeTab = useCallback(
    (tabKey: TabType) => {
      setActiveTab(tabKey);
      setLoadedTabs((prev) => new Set([...prev, tabKey]));

      if (updateURL) {
        const tab = [...myTabs, ...userTabs].find((t) => t.key === tabKey);
        if (tab) {
          // Use shallow routing to avoid full page reload
          router.push(tab.path, { scroll: false });
        }
      }
    },
    [updateURL, router, myTabs, userTabs]
  );

  const preloadTab = useCallback((tabKey: TabType) => {
    setLoadedTabs((prev) => new Set([...prev, tabKey]));
  }, []);

  // Initialize tab from URL if needed
  useEffect(() => {
    if (typeof window !== "undefined" && updateURL) {
      const path = window.location.pathname;
      const currentTab = [...myTabs, ...userTabs].find(
        (tab) => tab.path === path
      );
      if (currentTab && currentTab.key !== activeTab) {
        const tabKey = currentTab.key as TabType;
        if (isTabType(tabKey)) {
          setActiveTab(tabKey);
          setLoadedTabs((prev) => new Set([...prev, tabKey]));
        }
      }

      // Define a type guard function
      function isTabType(value: string): value is TabType {
        return Object.values(isTabType).includes(value as TabType);
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
