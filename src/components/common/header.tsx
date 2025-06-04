/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import logo from "@/asset/logo/logo.png";
import { AnimatePresence, motion } from "framer-motion";
import { LucideCalendarCheck, Search, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { BsChatSquareDots } from "react-icons/bs";
import { FaRegCalendarAlt, FaRegUserCircle } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { MdAlternateEmail, MdOutlineNotifications } from "react-icons/md";
import { Drawer } from "antd";
import CustomButton from "../custom/custom-button";
import useUser from "@/hooks/useUser";
import { IUser } from "@/types/user.types";
import { useRouter } from "next/navigation";
import MessagesDropdown from "./MessagesDropdown";
import NotificationsDropdown from "./NotificationsDropdown";
import UserDropdown from "./UserDropdown";

// Enhanced Search Results Dropdown Component
type SearchDropdownProps = {
  isOpen: boolean;
  searchValue: string;
  searchResults: {
    users: IUser[];
    hashtags: any[];
    locations: any[];
  };
  loading: boolean;
  onResultClick: (result: any, type: string) => void;
  onSearchPosts: (query: string) => void;
};

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  isOpen,
  searchValue,
  searchResults,
  // loading,
  onResultClick,
  onSearchPosts,
}) => {
  if (!isOpen) return null;

  const hasResults =
    searchResults.users.length > 0 ||
    searchResults.hashtags.length > 0 ||
    searchResults.locations.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
    >
      <div className="p-4">
        {hasResults ? (
          <div className="space-y-4">
            {/* Users Section */}
            {searchResults.users.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Users
                </h4>
                <div className="space-y-1">
                  {searchResults.users.map((user, index) => (
                    <div
                      key={`user-${index}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => onResultClick(user, "user")}
                    >
                      <div className="flex-shrink-0">
                        {user.profileImage ? (
                          <Image
                            src={user.profileImage}
                            width={32}
                            height={32}
                            className="size-8 rounded-full object-cover"
                            alt="user"
                          />
                        ) : (
                          <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaRegUserCircle
                              size={16}
                              className="text-gray-500"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.fullName || user.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          @{user.username}
                        </p>
                      </div>
                      {user.followersCount !== undefined && (
                        <div className="flex-shrink-0">
                          <span className="text-xs text-gray-400">
                            {user.followersCount} Followers
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hashtags Section */}
            {searchResults.hashtags.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Hashtags
                </h4>
                <div className="space-y-1">
                  {searchResults.hashtags.map((hashtag, index) => (
                    <div
                      key={`hashtag-${index}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => onResultClick(hashtag, "hashtag")}
                    >
                      <div className="flex-shrink-0">
                        <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">
                            #
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          #{hashtag.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {hashtag.postsCount} Posts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Locations Section */}
            {searchResults.locations.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Locations
                </h4>
                <div className="space-y-1">
                  {searchResults.locations.map((location, index) => (
                    <div
                      key={`location-${index}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => onResultClick(location, "location")}
                    >
                      <div className="flex-shrink-0">
                        <div className="size-8 rounded-full bg-green-100 flex items-center justify-center">
                          <FiMapPin size={16} className="text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {location.locationName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {location.postsCount} Posts
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Posts Option - Always show at bottom when there are results */}
            <div className="border-t pt-3">
              <div
                className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                onClick={() => onSearchPosts(searchValue)}
              >
                <div className="flex-shrink-0">
                  <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Search size={16} className="text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Search for {searchValue} in posts
                  </p>
                  <p className="text-xs text-gray-500">
                    Find posts containing your search term
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : searchValue ? (
          // No results found - Show option to search in posts
          <div className="text-center p-2">
            {/* Search Posts Button */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onSearchPosts(searchValue)}
            >
              <div className="flex-shrink-0">
                <Search size={24} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-base font-medium text-gray-900">
                  {searchValue}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Search size={24} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Start typing to search...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Mobile Menu Component
const MobileMenu: React.FC<{
  user?: IUser;
  isOpen: boolean;
  onClose: () => void;
}> = ({ user, isOpen, onClose }) => {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie =
      "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.reload();
    router.push("/");
  };

  return (
    <Drawer
      title={null}
      placement="right"
      closable={false}
      onClose={onClose}
      open={isOpen}
      width="100%"
      className="mobile-drawer"
      styles={{
        body: { padding: 0 },
        header: { display: "none" },
      }}
    >
      <div>
        <Link href={`/${user?.username}`}>
          <div className="flex items-center gap-3 mb-4 bg-[#ECFCFA] p-4 rounded-xl">
            {user?.profileImage && (
              <Image
                src={user?.profileImage}
                width={40}
                height={40}
                className="size-14 rounded-full flex-shrink-0"
                alt="user"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.fullName}</p>
              <p className="text-sm text-gray-500 truncate">
                @{user?.username}
              </p>
            </div>
          </div>
        </Link>
        <div className="space-y-3 overflow-y-auto">
          <Link href={`/${user?.username}`} className="block text-black">
            <button className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4">
              <FaRegUserCircle size={24} />
              <span>My Profile</span>
            </button>
          </Link>
          <Link
            href="/"
            className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
          >
            <LucideCalendarCheck size={24} />
            <span>Timeline</span>
          </Link>
          <Link
            href="/messages"
            className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
          >
            <IoChatboxEllipsesOutline size={24} />
            <span>Messages</span>
            <span className="ml-2 size-6 rounded-full bg-primary text-white flex justify-center items-center text-sm">
              5
            </span>
          </Link>
          <Link
            href="/"
            className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
          >
            <MdOutlineNotifications size={24} />
            <span>Notifications</span>
          </Link>
          <Link href="/groups" className="block text-black">
            <button className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4">
              <HiOutlineUserGroup size={24} />
              <span>Groups</span>
            </button>
          </Link>
          <Link
            href={`/${user?.username}/maps`}
            className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4 "
          >
            <FiMapPin size={24} />
            <span>Maps</span>
          </Link>
          <Link
            href="/events"
            className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
          >
            <FaRegCalendarAlt size={24} />
            <span>Events</span>
          </Link>
          <Link
            href={`/${user?.username}/invitations`}
            className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
          >
            <MdAlternateEmail size={24} />
            <span>Invitations</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full cursor-pointer flex items-center px-4 py-3 gap-4 text-red-500 hover:bg-gray-100 rounded-xl"
          >
            <BiLogOut size={24} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </Drawer>
  );
};

// Header Component
const Header: React.FC = () => {
  const user = useUser();
  const router = useRouter();
  // Desktop/Tablet dropdown states
  const [isMessagesOpen, setIsMessagesOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState<boolean>(false);
  const [isUserOpen, setIsUserOpen] = useState<boolean>(false);

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Search bar state for mobile/tablet
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  // Search dropdown states
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] =
    useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{
    users: any[];
    hashtags: any[];
    locations: any[];
  }>({
    users: [],
    hashtags: [],
    locations: [],
  });
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const messagesRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        messagesRef.current &&
        !messagesRef.current.contains(event.target as Node)
      ) {
        setIsMessagesOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle search input changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue.trim()) {
        handleSearch(searchValue);
        setIsSearchDropdownOpen(true);
      } else {
        setSearchResults({
          users: [],
          hashtags: [],
          locations: [],
        });
        setIsSearchDropdownOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Function to handle search - replace with your API call
  const handleSearch = async (query: string) => {
    setSearchLoading(true);
    try {
      // TODO: Replace with your actual API calls
      const [usersResponse, hashtagsResponse, locationsResponse] =
        await Promise.all([
          fetch(`/api/users/search?q=${encodeURIComponent(query)}`),
          fetch(`/api/hashtags/search?q=${encodeURIComponent(query)}`),
          fetch(`/api/posts/locations/search?q=${encodeURIComponent(query)}`),
        ]);

      const [usersData, hashtagsData, locationsData] = await Promise.all([
        usersResponse.json(),
        hashtagsResponse.json(),
        locationsResponse.json(),
      ]);

      setSearchResults({
        users: usersData.users || [],
        hashtags: hashtagsData.hashtags || [],
        locations: locationsData.locations || [],
      });
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({
        users: [],
        hashtags: [],
        locations: [],
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const toggleMessages = () => {
    setIsMessagesOpen((prev) => !prev);
    setIsNotificationsOpen(false);
    setIsUserOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
    setIsMessagesOpen(false);
    setIsUserOpen(false);
  };

  const toggleUser = () => {
    setIsUserOpen((prev) => !prev);
    setIsMessagesOpen(false);
    setIsNotificationsOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (isSearchOpen) {
      setSearchValue("");
      setIsSearchDropdownOpen(false);
    }
  };

  // Updated handleSearchSubmit function in Header component
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // If no suggestions shown or user pressed Enter, go to posts search
      handleSearchPosts(searchValue.trim());
    }
  };

  // New function to handle post search navigation
  const handleSearchPosts = (query: string) => {
    // Navigate to posts search page with query parameter
    router.push(`/search/posts?q=${encodeURIComponent(query)}`);

    // Close dropdown and clear search
    setIsSearchDropdownOpen(false);
    setSearchValue("");
    setIsSearchOpen(false); // Close mobile search too
  };

  const handleSearchResultClick = (result: any, type: string) => {
    console.log("Clicked result:", result, "Type:", type);

    // Navigate based on result type
    const router = useRouter();

    switch (type) {
      case "user":
        // Navigate to user profile page
        router.push(`/${result.username}`);
        break;
      case "hashtag":
        // Navigate to hashtag posts page
        router.push(`/hashtag/${result.name}`);
        break;
      case "location":
        // Navigate to location posts page
        router.push(`/location/${encodeURIComponent(result.locationName)}`);
        break;
      default:
        console.log("Unknown result type");
    }

    // Close dropdown and clear search
    setIsSearchDropdownOpen(false);
    setSearchValue("");
  };

  const handleSearchFocus = () => {
    if (searchValue.trim()) {
      setIsSearchDropdownOpen(true);
    }
  };

  return (
    <nav className="w-full bg-[#F0FAF9] h-[72px] md:h-[88px] lg:h-[112px] fixed top-0 left-0 z-50">
      <div className="w-full container mx-auto grid grid-cols-5 justify-between items-center h-full px-4 md:px-5 gap-3 md:gap-5">
        {/* Logo */}
        <Link href={"/"} className="col-span-1">
          <Image src={logo.src} alt="logo" width={75} height={75} />
        </Link>

        {/* Search Bar - Always visible on Desktop, conditional on Tablet/Mobile */}
        <div className="col-span-3 flex items-center relative">
          <AnimatePresence mode="wait">
            {isSearchOpen ? (
              <motion.div
                key="mobile-search"
                ref={searchRef}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-1 max-w-3xl mx-auto bg-white rounded-xl border border-white overflow-hidden relative"
              >
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    name="search"
                    id="mobile-search"
                    className="w-full px-3 py-2 md:py-3 outline-none text-sm md:text-base"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={handleSearchFocus}
                  />
                  <button
                    type="submit"
                    className="p-2 hover:bg-gray-50 rounded-r-xl"
                  >
                    <Search className="text-gray-500" size={18} />
                  </button>
                </form>
                <SearchDropdown
                  isOpen={isSearchDropdownOpen}
                  searchValue={searchValue}
                  searchResults={searchResults}
                  loading={searchLoading}
                  onResultClick={handleSearchResultClick}
                  onSearchPosts={handleSearchPosts} // Add this new prop
                />
              </motion.div>
            ) : (
              <motion.div
                key="desktop-search"
                ref={desktopSearchRef}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="hidden md:flex-1 max-w-3xl mx-auto bg-white rounded-xl border border-white md:flex justify-between items-center relative"
              >
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="flex-1 px-3 py-2 md:py-3 outline-none text-sm md:text-base"
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={handleSearchFocus}
                />
                <Search className="text-gray-500 mr-2" size={20} />
                <SearchDropdown
                  isOpen={isSearchDropdownOpen}
                  searchValue={searchValue}
                  searchResults={searchResults}
                  loading={searchLoading}
                  onResultClick={handleSearchResultClick}
                  onSearchPosts={handleSearchPosts} // Add this new prop
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop/Tablet Actions */}
        {user ? (
          <div className="w-full col-span-1 hidden md:flex justify-end items-center gap-3 md:gap-5 relative">
            {!isSearchOpen && (
              <motion.button
                onClick={toggleSearch}
                className="flex md:hidden size-10 md:size-12 rounded-full border border-[#40E0D0] bg-white justify-center items-center cursor-pointer hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search size={20} />
              </motion.button>
            )}

            <div ref={messagesRef}>
              <motion.button
                onClick={toggleMessages}
                className="size-10 md:size-12 lg:size-14 rounded-full border border-[#40E0D0] bg-white flex justify-center items-center relative cursor-pointer hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BsChatSquareDots size={24} />
              </motion.button>
              <MessagesDropdown isOpen={isMessagesOpen} />
            </div>

            <div ref={notificationsRef}>
              <motion.button
                onClick={toggleNotifications}
                className="size-10 md:size-12 lg:size-14 rounded-full border border-[#40E0D0] bg-white flex justify-center items-center relative cursor-pointer hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoMdNotificationsOutline size={28} />
              </motion.button>
              <NotificationsDropdown isOpen={isNotificationsOpen} />
            </div>

            <div ref={userRef}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={user?.profileImage}
                  width={56}
                  height={56}
                  onClick={toggleUser}
                  className="size-10 md:size-12 lg:size-14 ring ring-[#40E0D0] rounded-full cursor-pointer hover:ring-2 transition-all"
                  alt="userImage"
                />
              </motion.div>
              <UserDropdown user={user} isOpen={isUserOpen} />
            </div>
          </div>
        ) : (
          <div className="w-full col-span-1 hidden md:flex items-center">
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CustomButton
                  variant="default"
                  className="px-6 md:px-9 py-2 md:py-3"
                >
                  Login
                </CustomButton>
              </motion.div>
            </Link>
          </div>
        )}

        {/* Mobile Actions */}
        <motion.div
          className="block md:hidden items-center gap-3"
          animate={{
            marginLeft: isSearchOpen ? "8px" : "0px",
          }}
          transition={{ duration: 0.3 }}
        >
          {user ? (
            <>
              {!isSearchOpen && (
                <motion.button
                  onClick={toggleSearch}
                  className="p-2 rounded-full hover:bg-white/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search size={20} />
                </motion.button>
              )}

              {isSearchOpen && (
                <motion.button
                  onClick={toggleSearch}
                  className="p-2 rounded-full hover:bg-white/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={20} />
                </motion.button>
              )}

              {!isSearchOpen && (
                <motion.button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-full hover:bg-white/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu size={24} />
                </motion.button>
              )}
            </>
          ) : (
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CustomButton variant="default" className="px-4 py-2 text-sm">
                  Login
                </CustomButton>
              </motion.div>
            </Link>
          )}
        </motion.div>
      </div>
      {/* Mobile Menu Drawer */}
      <MobileMenu
        user={user}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
};

export default Header;
