import { useState, useCallback, useMemo } from 'react';
import { useGetSearchHashtagAndUsersQuery } from "@/redux/features/search/searchApi";

export const useHeaderSearch = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);

  // Debounced search query
  const debouncedQuery = useMemo(() => {
    if (searchQuery.length < 2) return "";
    return searchQuery;
  }, [searchQuery]);

  // API call with skip for empty queries
  const { data: searchData, isLoading: searchLoading } = useGetSearchHashtagAndUsersQuery(
    debouncedQuery,
    {
      skip: !debouncedQuery,
      refetchOnFocus: false,
      refetchOnMountOrArgChange: false,
    }
  );

  // Memoized search results processing
  const searchResults = useMemo(() => {
    if (!searchData?.data?.attributes) return null;

    const { users = [], hashtags = [] } = searchData.data.attributes;
    
    return {
      users: users.slice(0, 5), // Limit to 5 users
      hashtags: hashtags.slice(0, 5), // Limit to 5 hashtags
      total: users.length + hashtags.length
    };
  }, [searchData]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setShowSearchDropdown(value.length > 0);
  }, []);

  const handleSearchFocus = useCallback(() => {
    if (searchQuery.length > 0) {
      setShowSearchDropdown(true);
    }
  }, [searchQuery]);

  const handleSearchBlur = useCallback(() => {
    // Delay to allow click on dropdown items
    setTimeout(() => setShowSearchDropdown(false), 200);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setShowSearchDropdown(false);
  }, []);

  return {
    searchQuery,
    showSearchDropdown,
    searchResults,
    searchLoading,
    handleSearchChange,
    handleSearchFocus,
    handleSearchBlur,
    clearSearch,
    setShowSearchDropdown
  };
};