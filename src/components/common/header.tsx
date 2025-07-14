"use client";

import logo from "@/asset/logo/logo2.png";
import { AnimatePresence, motion } from "framer-motion";
import { LucideCalendarCheck, Search, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { BiLogOut } from "react-icons/bi";
import { BsChatSquareDots } from "react-icons/bs";
import { FaRegCalendarAlt, FaRegUserCircle } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { MdAlternateEmail, MdOutlineNotifications } from "react-icons/md";
import CustomButton from "../custom/custom-button";
import useUser from "@/hooks/useUser";
import { IUser } from "@/types/user.types";
import { useRouter } from "next/navigation";
import MessagesDropdown from "./MessagesDropdown";
import NotificationsDropdown from "./NotificationsDropdown";
import UserDropdown from "./UserDropdown";
import { useSocket } from "@/lib/socket";
import { IHashtag, ISearchResult } from "@/types/search.types";
import SearchDropdown from "./SearchDropdown";
import { useGetSearchHashtagAndUsersQuery } from "@/redux/features/search/searchApi";
import LocationPermission from "./LocationPermission";
import { useGetUnviewedNotificationsCountQuery } from "@/redux/features/notifications/notificationsApi";

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-lg"
        >
          <div className="p-5">
            <div className="flex justify-end">
              <button onClick={onClose} className="p-2">
                <X size={24} />
              </button>
            </div>
            <div className="mt-5">
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
                  <button className="w-full text-left text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4">
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
                  <span className="ml-auto size-6 rounded-full bg-primary text-white flex justify-center items-center text-sm">
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
                  <button className="w-full text-left text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4">
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Header Component
const Header: React.FC = () => {
  const { socket } = useSocket();
  const router = useRouter();

  // notification
  const user = useUser();
  const [unviewNotificationCount, setUnviewNotificationCount] =
    useState<number>(0);

  // Get unviewed notification count
  const { data: notificationCountData } =
    useGetUnviewedNotificationsCountQuery(undefined);

  // set socket
  useEffect(() => {
    if (socket && user) {
      const notificationEvent = `notification::${user?._id}`;
      socket.on(notificationEvent, () => {
        setUnviewNotificationCount(
          (unviewNotificationCount) => unviewNotificationCount + 1
        );
      });
    }
  }, [socket, user]);

  // Set initial unviewed count from API
  useEffect(() => {
    if (notificationCountData?.data?.attributes?.count) {
      setUnviewNotificationCount(
        notificationCountData?.data?.attributes?.count
      );
    }
  }, [notificationCountData]);

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
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>("");

  // Search dropdown states
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] =
    useState<boolean>(false);

  // Search results
  const [searchResults, setSearchResults] = useState<ISearchResult>({
    users: [],
    hashtags: [],
  });

  // API call with debounced search value
  const { data: responseData, isLoading: searchLoading } =
    useGetSearchHashtagAndUsersQuery(debouncedSearchValue, {
      refetchOnMountOrArgChange: true,
      skip: !debouncedSearchValue.trim(), // Skip if empty or only whitespace
    });

  const messagesRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("user/connect", { userId: user?._id });
      return () => {
        socket.emit("user/disconnect", { userId: user?._id });
      };
    }
  }, [socket, user]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Handle search results
  useEffect(() => {
    if (responseData?.data?.attributes) {
      setSearchResults(responseData.data.attributes);
    } else if (!debouncedSearchValue.trim()) {
      // Clear results when search is empty
      setSearchResults({ users: [], hashtags: [] });
    }
  }, [responseData, debouncedSearchValue]);

  // Handle click outside to close dropdowns
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

  // Close other dropdowns when one opens
  const toggleMessages = () => {
    setIsMessagesOpen((prev) => !prev);
    setIsNotificationsOpen(false);
    setIsUserOpen(false);
  };

  const toggleNotifications = () => {
    console.log("Clicked");
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
      // Clear search when closing
      setSearchValue("");
      setDebouncedSearchValue("");
      setIsSearchDropdownOpen(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Show dropdown if there's a value
    if (value.trim()) {
      setIsSearchDropdownOpen(true);
    } else {
      setIsSearchDropdownOpen(false);
    }
  };

  // Handle search focus
  const handleSearchFocus = () => {
    // Always show dropdown on focus if there's a search value
    if (searchValue.trim()) {
      setIsSearchDropdownOpen(true);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      handleSearch(searchValue.trim());
    }
  };

  // Navigate to posts search page
  const handleSearch = useCallback(
    (query: string) => {
      router.push(`/search/posts-locations?q=${encodeURIComponent(query)}`);
      // Reset search state after navigation
      setIsSearchDropdownOpen(false);
      setSearchValue("");
      setDebouncedSearchValue("");
      setIsSearchOpen(false);
    },
    [router]
  );

  // Handle search result clicks
  const handleSearchResultClick = useCallback(
    (result: IUser | IHashtag, type: string) => {
      switch (type) {
        case "user":
          const userResult = result as IUser;
          router.push(`/${userResult?.username}`);
          break;
        case "hashtag":
          const hashtagResult = result as IHashtag;
          router.push(`/search/hashtag?q=${hashtagResult?.name}`);
          break;
        default:
          console.log("Unknown result type");
      }

      // Reset search state after navigation
      setIsSearchDropdownOpen(false);
      setSearchValue("");
      setDebouncedSearchValue("");
      setIsSearchOpen(false);
    },
    [router]
  );

  return (
    <nav className="w-full bg-[#F0FAF9] h-[72px] md:h-[88px] lg:h-[112px] fixed top-0 left-0 z-40">
      <div className="w-full container mx-auto flex justify-between items-center h-full px-4 md:px-5">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href={"/"}>
            <Image
              src={logo.src}
              alt="logo"
              width={180}
              height={60}
              className="w-36 md:w-44 lg:w-[220px]"
            />
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-3xl mx-auto relative">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-[720px] mx-auto flex items-center bg-white rounded-xl border border-gray-100"
          >
            <input
              type="text"
              name="search"
              id="search"
              className="w-full px-4 py-3 outline-none text-base rounded-l-xl"
              placeholder="Search"
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
            />
            <button type="submit" className="px-4">
              <Search className="text-gray-500" size={20} />
            </button>
          </form>
          <SearchDropdown
            isOpen={isSearchDropdownOpen}
            searchValue={searchValue}
            searchResults={searchResults}
            loading={searchLoading}
            onResultClick={handleSearchResultClick}
            onSearch={handleSearch}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3 lg:gap-5">
          {/* Search Icon - Mobile/Tablet */}
          <button
            onClick={toggleSearch}
            className="lg:hidden size-10 md:size-12 rounded-full border border-[#40E0D0] bg-white flex justify-center items-center cursor-pointer hover:shadow-md transition-shadow"
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {user ? (
            <>
              {/* Desktop/Tablet Icons */}
              <div className="hidden md:flex items-center gap-3 lg:gap-5">
                <div ref={messagesRef} className="relative">
                  <motion.button
                    onClick={toggleMessages}
                    className="size-12 lg:size-14 rounded-full border border-[#40E0D0] bg-white flex justify-center items-center cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <BsChatSquareDots size={24} />
                  </motion.button>
                  <MessagesDropdown isOpen={isMessagesOpen} user={user} />
                </div>

                <div ref={notificationsRef} className="relative">
                  <motion.button
                    onClick={toggleNotifications}
                    className="size-12 lg:size-14 rounded-full border border-[#40E0D0] bg-white flex justify-center items-center cursor-pointer hover:shadow-md transition-shadow "
                  >
                    <IoMdNotificationsOutline size={28} />
                    {unviewNotificationCount > 0 && (
                      <div className="absolute top-0 right-0 size-5 bg-primary rounded-full flex justify-center items-center text-xs font-bold text-white">
                        {unviewNotificationCount}
                      </div>
                    )}
                  </motion.button>
                  <NotificationsDropdown isOpen={isNotificationsOpen} />
                </div>

                <div ref={userRef} className="relative">
                  <motion.div
                  >
                    <Image
                      src={user?.profileImage || "/path/to/default-avatar.png"}
                      width={56}
                      height={56}
                      onClick={toggleUser}
                      className="size-12 lg:size-14 ring ring-[#40E0D0] rounded-full cursor-pointer hover:ring-2 transition-all object-cover"
                      alt="userImage"
                    />
                  </motion.div>
                  <UserDropdown user={user} isOpen={isUserOpen} />
                </div>
              </div>

              {/* Mobile Menu Icon */}
              <div className="md:hidden">
                <motion.button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-full hover:bg-white/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu size={24} />
                </motion.button>
              </div>
            </>
          ) : (
            <div className="hidden md:block">
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
        </div>
      </div>

      {/* Mobile/Tablet Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-[72px] md:top-[88px] left-0 w-full bg-[#F0FAF9] p-4 z-30 shadow-md"
          >
            <div ref={searchRef} className="relative">
              <form
                onSubmit={handleSearchSubmit}
                className="w-full max-w-[720px] mx-auto flex items-center bg-white rounded-xl border border-gray-100"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  name="search"
                  id="mobile-search"
                  className="w-full px-4 py-3 outline-none text-base rounded-l-xl"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                />
                <button type="submit" className="px-4">
                  <Search className="text-gray-500" size={20} />
                </button>
              </form>
              <SearchDropdown
                isOpen={isSearchDropdownOpen}
                searchValue={searchValue}
                searchResults={searchResults}
                loading={searchLoading}
                onResultClick={handleSearchResultClick}
                onSearch={handleSearch}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        user={user}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      {/* Location Permission */}
      <LocationPermission />
    </nav>
  );
};

export default Header;
