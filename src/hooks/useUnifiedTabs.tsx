import { useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

export interface TabConfig {
  key: string;
  label: string;
  component?: React.ComponentType<Record<string, unknown>>;
  icon?: React.ReactNode;
}

interface UseUnifiedTabsOptions {
  tabs: TabConfig[];
  defaultTab?: string;
  useUrlParam?: boolean;
  urlParamName?: string;
  onTabChange?: (tabKey: string) => void;
}

interface UseUnifiedTabsReturn {
  activeTab: string;
  setActiveTab: (tabKey: string) => void;
  tabs: TabConfig[];
  isTabActive: (tabKey: string) => boolean;
  getTabButtonClasses: (tabKey: string) => string;
  renderTabButtons: () => React.ReactNode;
}

/**
 * Unified tab management hook that handles:
 * - Local state management
 * - URL parameter synchronization (optional)
 * - Consistent styling
 * - Tab change callbacks
 */
export const useUnifiedTabs = ({
  tabs,
  defaultTab,
  useUrlParam = false,
  urlParamName = 'tab',
  onTabChange
}: UseUnifiedTabsOptions): UseUnifiedTabsReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize active tab from URL or default
  const initialTab = useUrlParam 
    ? searchParams.get(urlParamName) || defaultTab || tabs[0]?.key
    : defaultTab || tabs[0]?.key;
    
  const [activeTab, setActiveTabState] = useState<string>(initialTab);

  // Memoize tab lookup for performance
  const tabsMap = useMemo(() => {
    const map = new Map<string, TabConfig>();
    tabs.forEach(tab => map.set(tab.key, tab));
    return map;
  }, [tabs]);

  const setActiveTab = useCallback((tabKey: string) => {
    if (!tabsMap.has(tabKey)) {
      console.warn(`Tab "${tabKey}" not found in tabs configuration`);
      return;
    }

    setActiveTabState(tabKey);

    // Update URL if using URL params
    if (useUrlParam && typeof window !== 'undefined') {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set(urlParamName, tabKey);
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.replace(`${window.location.pathname}${query}`, { scroll: false });
    }

    // Execute callback
    onTabChange?.(tabKey);
  }, [tabsMap, useUrlParam, urlParamName, searchParams, router, onTabChange]);

  const isTabActive = useCallback((tabKey: string) => {
    return activeTab === tabKey;
  }, [activeTab]);

  const getTabButtonClasses = useCallback((tabKey: string) => {
    const baseClasses = "px-6 py-2 rounded-xl font-semibold transition-colors cursor-pointer";
    const activeClasses = "bg-[#E9F8F9] border border-primary text-primary";
    const inactiveClasses = "hover:bg-gray-100 text-gray-700";
    
    return `${baseClasses} ${isTabActive(tabKey) ? activeClasses : inactiveClasses}`;
  }, [isTabActive]);

  const renderTabButtons = useCallback((): React.ReactNode => {
    return (
      <div className="flex space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={getTabButtonClasses(tab.key)}
            aria-selected={isTabActive(tab.key)}
            role="tab"
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }, [tabs, setActiveTab, getTabButtonClasses, isTabActive]);

  return {
    activeTab,
    setActiveTab,
    tabs,
    isTabActive,
    getTabButtonClasses,
    renderTabButtons,
  };
};