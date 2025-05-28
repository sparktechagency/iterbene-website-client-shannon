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
import { IoChatboxEllipsesOutline, IoSettingsOutline } from "react-icons/io5";
import { MdAlternateEmail, MdOutlineNotifications } from "react-icons/md";
import { Drawer } from "antd";
import CustomButton from "../custom/custom-button";
import useUser from "@/hooks/useUser";
import { IUser } from "@/types/user.types";
import { useRouter } from "next/navigation";

// Define types for dropdown props
interface DropdownProps {
  user?: IUser;
  isOpen: boolean;
}
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

// Dropdown component for Messages (Desktop/Tablet)
const MessagesDropdown: React.FC<DropdownProps> = ({ isOpen }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickInside = (event: MouseEvent) => {
      event.stopPropagation();
    };

    const dropdownElement = dropdownRef.current;
    if (dropdownElement) {
      dropdownElement.addEventListener("click", handleClickInside);
    }

    return () => {
      if (dropdownElement) {
        dropdownElement.removeEventListener("click", handleClickInside);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-16 right-0 bg-white rounded-xl shadow-lg p-6 w-[min(662px,90vw)] z-50"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Messages</h3>
            <button className="text-sm text-primary">Mark all as read</button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
                >
                  <Image
                    src="https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg"
                    width={60}
                    height={60}
                    className="size-14 rounded-full flex-shrink-0"
                    alt="user"
                  />
                  <div className="flex-1 min-w-0">
                    <h1 className="font-medium truncate">
                      <span className="font-semibold">Alexandra Broke</span>{" "}
                      send you <span className="font-semibold">Message</span>
                    </h1>
                    <p className="text-sm text-gray-500">1 min ago</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="w-3 h-3 bg-primary rounded-full block"></span>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-3 border-t border-[#E2E8F0] pt-5 flex justify-center items-center">
            <h1 className="text-primary text-sm cursor-pointer">
              View all messages
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Dropdown component for Notifications (Desktop/Tablet)
const NotificationsDropdown: React.FC<DropdownProps> = ({ isOpen }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickInside = (event: MouseEvent) => {
      event.stopPropagation();
    };

    const dropdownElement = dropdownRef.current;
    if (dropdownElement) {
      dropdownElement.addEventListener("click", handleClickInside);
    }

    return () => {
      if (dropdownElement) {
        dropdownElement.removeEventListener("click", handleClickInside);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-16 right-0 bg-white rounded-xl shadow-lg p-6 w-[min(662px,90vw)] z-50"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <button className="text-sm text-primary">Mark all as read</button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
                >
                  <Image
                    src="https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg"
                    width={60}
                    height={60}
                    className="size-14 rounded-full flex-shrink-0"
                    alt="user"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {index % 2 === 0
                        ? "Your password was changed"
                        : "Alexandra Brooke sent you a connection request"}
                    </p>
                    <p className="text-sm text-gray-500">1 week ago</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="w-3 h-3 bg-primary rounded-full block"></span>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-3 border-t border-[#E2E8F0] pt-5 flex justify-center items-center">
            <h1 className="text-primary text-sm cursor-pointer">
              View all notifications
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Dropdown component for Settings (Desktop only)
const SettingsDropdown: React.FC<DropdownProps> = ({ isOpen }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickInside = (event: MouseEvent) => {
      event.stopPropagation();
    };

    const dropdownElement = dropdownRef.current;
    if (dropdownElement) {
      dropdownElement.addEventListener("click", handleClickInside);
    }

    return () => {
      if (dropdownElement) {
        dropdownElement.removeEventListener("click", handleClickInside);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-1 left-[-228px] bg-white rounded-xl p-3.5 w-[228px] z-50 shadow-xl"
        >
          <div className="space-y-3">
            <Link
              href="/about-us"
              className="text-gray-800 hover:bg-[#ECFCFA] p-3 rounded-xl flex items-center gap-4 text-sm"
            >
              About Us
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-gray-800 hover:bg-[#ECFCFA] p-3 rounded-xl flex items-center gap-4 text-sm"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="text-gray-800 hover:bg-[#ECFCFA] p-3 rounded-xl flex items-center gap-4 text-sm"
            >
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Dropdown component for User Profile (Desktop/Tablet)
const UserDropdown: React.FC<DropdownProps> = ({ user, isOpen }) => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleClickInside = (event: MouseEvent) => {
      event.stopPropagation();
    };

    const dropdownElement = dropdownRef.current;
    if (dropdownElement) {
      dropdownElement.addEventListener("click", handleClickInside);
    }

    return () => {
      if (dropdownElement) {
        dropdownElement.removeEventListener("click", handleClickInside);
      }
    };
  }, []);

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

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
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-16 right-0 bg-white rounded-xl shadow-md p-6 w-[min(430px,90vw)] z-50"
        >
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
            <Link
              href={`/${user?.username}`}
              className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
            >
              <FaRegUserCircle size={24} />
              <span>My Profile</span>
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
            <div className="relative">
              <button
                onClick={toggleSettings}
                className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4 w-full text-left cursor-pointer"
              >
                <IoSettingsOutline size={24} />
                <span>Settings</span>
              </button>
              <SettingsDropdown isOpen={isSettingsOpen} />
            </div>
            <button
              onClick={handleLogout}
              className="w-full cursor-pointer flex items-center px-4 py-3 gap-4 text-red-500 hover:bg-gray-100 rounded-xl"
            >
              <BiLogOut size={24} />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Header Component
const Header: React.FC = () => {
  const user = useUser();
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

  const messagesRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
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
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Search:", searchValue);
    setIsSearchOpen(false);
    setSearchValue("");
  };

  return (
    <nav className="w-full bg-[#F0FAF9] h-[72px] md:h-[88px] lg:h-[112px] fixed top-0 left-0 z-50">
      <div className="w-full container mx-auto flex justify-between items-center h-full px-4  md:px-5 gap-3 md:gap-5">
        {/* Logo */}
        <Link href={"/"} className="flex-shrink-0">
          <Image
            src={logo.src}
            alt="logo"
            width={75}
            height={75}
           
          />
        </Link>

        {/* Search Bar - Always visible on Desktop, conditional on Tablet/Mobile */}
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div
              key="mobile-search"
              ref={searchRef}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-1 max-w-2xl mx-auto bg-white rounded-xl border border-white overflow-hidden"
            >
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  name="search"
                  id="mobile-search"
                  className="w-full px-3 py-2 md:py-3 outline-none text-sm md:text-base"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button
                  type="submit"
                  className="p-2 hover:bg-gray-50 rounded-r-xl"
                >
                  <Search className="text-gray-500" size={18} />
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="desktop-search"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              className="hidden md:flex-1 max-w-2xl mx-auto  bg-white rounded-xl border border-white md:flex justify-between items-center"
            >
              <input
                type="text"
                name="search"
                id="search"
                className="flex-1 px-3 py-2 md:py-3 outline-none text-sm md:text-base"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Search className="text-gray-500 mr-2" size={20} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Desktop/Tablet Actions */}
        {user ? (
          <div className="hidden md:flex justify-end items-center gap-3 md:gap-5 relative">
            {!isSearchOpen && (
              <motion.button
                onClick={toggleSearch}
                className="flex md:hidden size-10 md:size-12 rounded-full border border-[#40E0D0] bg-white  justify-center items-center cursor-pointer hover:shadow-md transition-shadow"
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
          <div className="hidden md:flex items-center">
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
        {
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
        }
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
