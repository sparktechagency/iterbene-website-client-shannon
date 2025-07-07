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
import { Drawer } from "antd";
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
      width="60%"
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isUserOpen, setIsUserOpen] = useState<boolean>(false);

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Search bar state for mobile/tablet
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>("");

  // Search dropdown states
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);
  
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

  // Socket setup
  const { socket } = useSocket();
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
      handleSearchPosts(searchValue.trim());
    }
  };

  // Navigate to posts search page
  const handleSearchPosts = useCallback((query: string) => {
    router.push(`/search/posts?q=${encodeURIComponent(query)}`);
    // Reset search state after navigation
    setIsSearchDropdownOpen(false);
    setSearchValue("");
    setDebouncedSearchValue("");
    setIsSearchOpen(false);
  }, [router]);

  // Handle search result clicks
  const handleSearchResultClick = useCallback((result: IUser | IHashtag, type: string) => {
    switch (type) {
      case "user":
        const userResult = result as IUser;
        router.push(`/${userResult?.username}`);
        break;
      case "hashtag":
        const hashtagResult = result as IHashtag;
        router.push(`/hashtag/${hashtagResult?.name}`);
        break;
      default:
        console.log("Unknown result type");
    }

    // Reset search state after navigation
    setIsSearchDropdownOpen(false);
    setSearchValue("");
    setDebouncedSearchValue("");
    setIsSearchOpen(false);
  }, [router]);

  return (
    <nav className="w-full bg-[#F0FAF9] h-[72px] md:h-[88px] lg:h-[112px] fixed top-0 left-0 z-50">
      <div className="w-full container mx-auto grid grid-cols-5 justify-between items-center h-full px-4 md:px-5 gap-3 md:gap-5">
        {/* Logo */}
        <Link href={"/"} className="col-span-1">
          <Image src={logo.src} alt="logo" width={220} height={75} />
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
                    onChange={handleSearchChange}
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
                  onSearchPosts={handleSearchPosts}
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
                <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="flex-1 px-3 py-2 md:py-3 outline-none text-sm md:text-base"
                    placeholder="Search"
                    value={searchValue}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                  />
                  <button type="submit" className="p-2">
                    <Search className="text-gray-500" size={20} />
                  </button>
                </form>
                <SearchDropdown
                  isOpen={isSearchDropdownOpen}
                  searchValue={searchValue}
                  searchResults={searchResults}
                  loading={searchLoading}
                  onResultClick={handleSearchResultClick}
                  onSearchPosts={handleSearchPosts}
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
              <MessagesDropdown isOpen={isMessagesOpen} user={user} />
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
          className="flex justify-end md:hidden  items-center gap-3"
          animate={{
            marginLeft: isSearchOpen ? "8px" : "0px",
          }}
          transition={{ duration: 0.3 }}
        >
          {user ? (
            <div className="flex items-center">
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
            </div>
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