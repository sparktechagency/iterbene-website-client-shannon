"use client";

import logo from "@/asset/logo/logo2.png";
import useUser from "@/hooks/useUser";
import { useSocket } from "@/lib/socket";
import {
  useGetUnviewedMessageNotificationsCountQuery,
  useGetUnviewedNotificationsCountQuery,
  useViewAllMessageNotificationsMutation,
  useViewAllNotificationsMutation,
} from "@/redux/features/notifications/notificationsApi";
import { useGetSearchHashtagAndUsersQuery } from "@/redux/features/search/searchApi";
import { IHashtag, ISearchResult } from "@/types/search.types";
import { IUser } from "@/types/user.types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Images,
  LucideCalendarCheck,
  Menu,
  Newspaper,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BiLogOut } from "react-icons/bi";
import { BsChatSquareDots } from "react-icons/bs";
import { FaRegCalendarAlt, FaRegUserCircle } from "react-icons/fa";
import { FiMapPin, FiPlayCircle } from "react-icons/fi";
import { HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { MdAlternateEmail } from "react-icons/md";
import CustomButton from "../custom/custom-button";
import LocationPermission from "./LocationPermission";
import MessagesDropdown from "./MessagesDropdown";
import NotificationsDropdown from "./NotificationsDropdown";
import SearchDropdown from "./SearchDropdown";
import UserDropdown from "./UserDropdown";
import { useAuth } from "@/hooks/useAuth";

// Mobile Menu Component
const MobileMenu: React.FC<{
  user?: IUser;
  isOpen: boolean;
  onClose: () => void;
}> = ({ user, isOpen, onClose }) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    // Close mobile menu first
    onClose();
    await logout();
    router.push("/login");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-screen overflow-y-auto w-full max-w-sm bg-white z-50 shadow-lg"
        >
          <div className="p-5">
            <div className="w-full flex justify-between items-center">
              {/* logo */}
              <Image src={logo} alt="logo" width={100} height={100} />
              <button onClick={onClose} className="p-2">
                <X size={24} />
              </button>
            </div>
            <div className="mt-5">
              <div className="space-y-3 overflow-y-auto">
                <Link
                  onClick={onClose}
                  href={`/${user?.username}`}
                  className="block text-black"
                >
                  <button className="w-full text-left text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4">
                    <FaRegUserCircle size={24} />
                    <span>My Profile</span>
                  </button>
                </Link>
                {/* Feed */}
                <Link
                  onClick={onClose}
                  href={`/feed`}
                  className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
                >
                  <Newspaper size={24} />
                  <span>Feed</span>
                </Link>
                {/*  Connections */}
                <Link
                  onClick={onClose}
                  href="/connections"
                  className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
                >
                  <HiOutlineUsers size={24} />
                  <span>Connections</span>
                </Link>
                {/* Watch videos */}
                <Link
                  onClick={onClose}
                  href="/watch-videos"
                  className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
                >
                  <FiPlayCircle size={24} />
                  <span>Watch Videos</span>
                </Link>
                {/* Photos */}
                <Link
                  onClick={onClose}
                  href="/photos"
                  className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
                >
                  <Images size={24} />
                  <span>Photos</span>
                </Link>

                {/* Timeline */}
                <Link
                  onClick={onClose}
                  href={`/${user?.username}/timeline`}
                  className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
                >
                  <LucideCalendarCheck size={24} />
                  <span>Timeline</span>
                </Link>
                <Link
                  onClick={onClose}
                  href="/messages"
                  className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
                >
                  <IoChatboxEllipsesOutline size={24} />
                  <span>Messages</span>
                </Link>
                <Link
                  onClick={onClose}
                  href="/groups"
                  className="block text-black"
                >
                  <button className="w-full text-left text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4">
                    <HiOutlineUserGroup size={24} />
                    <span>Groups</span>
                  </button>
                </Link>
                <Link
                  onClick={onClose}
                  href={`/${user?.username}/maps`}
                  className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4 "
                >
                  <FiMapPin size={24} />
                  <span>Maps</span>
                </Link>
                <Link
                  onClick={onClose}
                  href="/events"
                  className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
                >
                  <FaRegCalendarAlt size={24} />
                  <span>Events</span>
                </Link>
                <Link
                  onClick={onClose}
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

  // User and notification states
  const user = useUser();
  const [unviewNotificationCount, setUnviewNotificationCount] =
    useState<number>(0);
  const [unviewMessageCount, setUnviewMessageCount] = useState<number>(0);

  // Fetch unviewed message and notification counts
  const { data: messageCountData } =
    useGetUnviewedMessageNotificationsCountQuery(undefined, {
      skip: !user,
    });
  // Fetch unviewed message and notification counts
  const { data: notificationCountData } = useGetUnviewedNotificationsCountQuery(
    undefined,
    {
      skip: !user,
    }
  );

  // viewall notifications
  const [viewAllNotifications] = useViewAllNotificationsMutation();

  // view all message notifications
  const [viewAllMessageNotifications] =
    useViewAllMessageNotificationsMutation();

  // Socket event listeners for notifications and messages
  useEffect(() => {
    if (socket && user?._id) {
      // Connect user
      socket.emit("user/connect", { userId: user._id });

      // Listen for general notifications
      const notificationEvent = `notification::${user?._id}`;
      socket.on(notificationEvent, () => {
        setUnviewNotificationCount((prev) => prev + 1);
      });

      // Listen for message notifications
      const messageNotificationEvent = `message-notification::${user?._id}`;
      socket.on(messageNotificationEvent, () => {
        setUnviewMessageCount((prev) => prev + 1);
      });

      // Cleanup on unmount or user/socket change
      return () => {
        socket.emit("user/disconnect", { userId: user._id });
        socket.off(notificationEvent);
        socket.off(messageNotificationEvent);
      };
    }
  }, [socket, user]);

  // Set initial unviewed counts from API with localStorage persistence
  useEffect(() => {
    if (notificationCountData?.data?.attributes?.count !== undefined) {
      const apiCount = notificationCountData.data.attributes.count;
      const lastViewedKey = `notifications_last_viewed_${user?._id}`;
      const lastViewed = localStorage.getItem(lastViewedKey);
      const now = Date.now();

      // If user viewed notifications recently (within 5 minutes) and API still shows count,
      // it means the API hasn't updated yet, so keep count at 0
      if (lastViewed && now - parseInt(lastViewed) < 5 * 60 * 1000) {
        setUnviewNotificationCount(0);
      } else {
        setUnviewNotificationCount(apiCount);
      }
    }
  }, [notificationCountData, user?._id]);

  useEffect(() => {
    if (messageCountData?.data?.attributes?.count !== undefined) {
      const apiCount = messageCountData.data.attributes.count;
      const lastViewedKey = `messages_last_viewed_${user?._id}`;
      const lastViewed = localStorage.getItem(lastViewedKey);
      const now = Date.now();

      // If user viewed messages recently (within 5 minutes) and API still shows count,
      // it means the API hasn't updated yet, so keep count at 0
      if (lastViewed && now - parseInt(lastViewed) < 5 * 60 * 1000) {
        setUnviewMessageCount(0);
      } else {
        setUnviewMessageCount(apiCount);
      }
    }
  }, [messageCountData, user?._id]);

  // Listen for immediate message notification updates from contact list
  useEffect(() => {
    const handleMessageNotificationViewed = (event: CustomEvent) => {
      const { unviewedCount } = event.detail;
      // Decrease the total unviewed count by the amount that was just viewed
      setUnviewMessageCount((prevCount) =>
        Math.max(0, prevCount - unviewedCount)
      );
    };

    window.addEventListener(
      "messageNotificationViewed",
      handleMessageNotificationViewed as EventListener
    );

    return () => {
      window.removeEventListener(
        "messageNotificationViewed",
        handleMessageNotificationViewed as EventListener
      );
    };
  }, []);

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
      skip: !debouncedSearchValue.trim(),
    });

  const messagesRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

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
  const toggleMessages = async () => {
    try {
      // Close other dropdowns first
      setIsNotificationsOpen(false);
      setIsUserOpen(false);

      // Toggle messages dropdown
      const newIsOpen = !isMessagesOpen;
      setIsMessagesOpen(newIsOpen);

      // If opening the dropdown, mark all messages as viewed and reset count
      if (newIsOpen && unviewMessageCount > 0) {
        // Set count to 0 optimistically and store timestamp
        setUnviewMessageCount(0);
        const lastViewedKey = `messages_last_viewed_${user?._id}`;
        localStorage.setItem(lastViewedKey, Date.now().toString());

        try {
          await viewAllMessageNotifications(undefined).unwrap();
        } catch (apiError) {
          console.error("Failed to mark messages as viewed:", apiError);
          // Don't show error to user as it's not critical for UX
        }
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err?.message || "Something went wrong!");
    }
  };

  const toggleNotifications = async () => {
    try {
      // Close other dropdowns first
      setIsMessagesOpen(false);
      setIsUserOpen(false);

      // Toggle notifications dropdown
      const newIsOpen = !isNotificationsOpen;
      setIsNotificationsOpen(newIsOpen);

      // If opening the dropdown, mark all notifications as viewed and reset count
      if (newIsOpen && unviewNotificationCount > 0) {
        // Set count to 0 optimistically and store timestamp
        setUnviewNotificationCount(0);
        const lastViewedKey = `notifications_last_viewed_${user?._id}`;
        localStorage.setItem(lastViewedKey, Date.now().toString());

        try {
          await viewAllNotifications(undefined).unwrap();
        } catch (apiError) {
          console.error("Failed to mark notifications as viewed:", apiError);
          // Don't show error to user as it's not critical for UX
        }
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err?.message || "Something went wrong!");
    }
  };

  const toggleUser = () => {
    setIsUserOpen(true);
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
      setDebouncedSearchValue("");
      setIsSearchDropdownOpen(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.trim()) {
      setIsSearchDropdownOpen(true);
    } else {
      setIsSearchDropdownOpen(false);
    }
  };

  // Handle search focus
  const handleSearchFocus = () => {
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
      setIsSearchDropdownOpen(false);
      setSearchValue("");
      setDebouncedSearchValue("");
      setIsSearchOpen(false);
    },
    [router]
  );
  const handleSearchResultClick = useCallback(
    (result: IUser | IHashtag, type: string) => {
      switch (type) {
        case "user":
          const userResult = result as IUser;
          router.push(`/${userResult?.username}/timeline`);
          break;
        case "hashtag":
          const hashtagResult = result as IHashtag;
          router.push(`/search/hashtag?q=${hashtagResult?.name}`);
          break;
      }
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
                    {unviewMessageCount > 0 && (
                      <div className="absolute top-0 right-0 size-5 bg-primary rounded-full flex justify-center items-center text-xs font-bold text-white">
                        {unviewMessageCount}
                      </div>
                    )}
                  </motion.button>
                  <MessagesDropdown
                    isOpen={isMessagesOpen}
                    setIsMessagesOpen={setIsMessagesOpen}
                  />
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
                  <NotificationsDropdown
                    isOpen={isNotificationsOpen}
                    setIsNotificationsOpen={setIsNotificationsOpen}
                  />
                </div>

                <div ref={userRef} onClick={toggleUser} className="relative">
                  <motion.div>
                    <Image
                      src={user?.profileImage || "/path/to/default-avatar.png"}
                      width={56}
                      height={56}
                      onClick={toggleUser}
                      className="size-12 lg:size-14 ring ring-[#40E0D0] rounded-full cursor-pointer transition-all object-cover hover:ring-2 hover:ring-primary"
                      alt="userImage"
                    />
                  </motion.div>
                  <UserDropdown
                    user={user}
                    isOpen={isUserOpen}
                    setIsUserOpen={setIsUserOpen}
                  />
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
