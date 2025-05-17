/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import logo from "@/asset/logo/logo.png";
import { AnimatePresence, motion } from "framer-motion";
import { LucideCalendarCheck, Search } from "lucide-react";
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
import CustomButton from "../custom/custom-button";
import useUser from "@/hooks/useUser";
import { IUser } from "@/types/user.types";

// Define types for dropdown props
interface DropdownProps {
  user?: IUser;
  isOpen: boolean;
}

// Dropdown component for Messages
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
          className="absolute top-16 right-0 bg-white rounded-xl shadow-lg p-6 w-[662px] z-50"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Messages</h3>
            <button className="text-sm text-primary">Mark all as read</button>
          </div>
          <div className="space-y-3">
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
                    className="size-14 rounded-full"
                    alt="user"
                  />
                  <div>
                    <h1 className="font-medium">
                      <span className="font-semibold">Alexandra Broke</span>{" "}
                      send you <span className="font-semibold">Message</span>
                    </h1>
                    <p className="text-sm text-gray-500">1 min ago</p>
                  </div>
                  <div className="ml-auto">
                    <span className="w-3 h-3 bg-primary rounded-full block"></span>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-3 border-t border-[#E2E8F0] pt-5 flex justify-center items-center">
            <h1 className="text-primary text-sm">View all messages</h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Dropdown component for Notifications
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
          className="absolute top-16 right-0 bg-white rounded-xl shadow-lg p-6 w-[662px] z-500"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <button className="text-sm text-primary">Mark all as read</button>
          </div>
          <div className="space-y-3">
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
                    className="size-14 rounded-full"
                    alt="user"
                  />
                  <div>
                    <p className="font-medium">
                      {index % 2 === 0
                        ? "Your password was changed"
                        : "Alexandra Brooke sent you a connection request"}
                    </p>
                    <p className="text-sm text-gray-500">1 week ago</p>
                  </div>
                  <div className="ml-auto">
                    <span className="w-3 h-3 bg-primary rounded-full block"></span>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-3 border-t border-[#E2E8F0] pt-5 flex justify-center items-center">
            <h1 className="text-primary text-sm">View all notifications</h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Dropdown component for Settings
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

// Dropdown component for User Profile
const UserDropdown: React.FC<DropdownProps> = ({ user, isOpen }) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-16 right-0 bg-white rounded-xl shadow-md p-6 w-[430px] z-50"
        >
          <div className="flex items-center gap-3 mb-4 bg-[#ECFCFA] p-4 rounded-xl">
            {user?.profileImage && (
              <Image
                src={user?.profileImage}
                width={40}
                height={40}
                className="size-14 rounded-full"
                alt="user"
              />
            )}

            <div>
              <p className="font-medium">{user?.fullName}</p>
              <p className="text-sm text-gray-500">@{user?.username}</p>
            </div>
          </div>
          <div className="space-y-3">
            <Link
              href="/my-profile"
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
            <Link
              href="/"
              className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
            >
              <MdOutlineNotifications size={24} />
              <span>Notifications</span>
            </Link>
            <Link
              href="/groups"
              className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
            >
              <HiOutlineUserGroup size={24} />
              <span>Groups</span>
            </Link>
            <Link
              href="/"
              className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
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
              href="/"
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
            <button className="w-full cursor-pointer flex items-center px-4 py-3 gap-4 text-red-500 hover:bg-gray-100 rounded-xl">
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
  const [isMessagesOpen, setIsMessagesOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState<boolean>(false);
  const [isUserOpen, setIsUserOpen] = useState<boolean>(false);

  const messagesRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
    <nav className="w-full bg-[#F0FAF9] h-[112px] fixed top-0 left-0 z-50">
      <div className="container flex justify-between gap-5 items-center">
        <Link href={"/"}>
          <Image src={logo.src} alt="logo" width={80} height={80} />
        </Link>
        <div className="w-full max-w-xl px-2 bg-white rounded-xl border border-white flex justify-between items-center">
          <input
            type="text"
            name="search"
            id="search"
            className="w-full px-3 py-3 outline-none"
            placeholder="Search"
          />
          <Search className="text-gray-500 mr-2" />
        </div>
        {user ? (
          <div className="flex items-center gap-5 relative">
            <div ref={messagesRef}>
              <button
                onClick={toggleMessages}
                className="size-10 md:size-14 rounded-full border border-[#40E0D0] bg-white flex justify-center items-center relative cursor-pointer"
              >
                <BsChatSquareDots size={24} />
              </button>
              <MessagesDropdown isOpen={isMessagesOpen} />
            </div>
            <div ref={notificationsRef}>
              <button
                onClick={toggleNotifications}
                className="size-10 md:size-14 rounded-full border border-[#40E0D0] bg-white flex justify-center items-center relative cursor-pointer"
              >
                <IoMdNotificationsOutline size={28} />
              </button>
              <NotificationsDropdown isOpen={isNotificationsOpen} />
            </div>
            <div ref={userRef}>
              <Image
                src="https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg"
                width={56}
                height={56}
                onClick={toggleUser}
                className="size-14 ring ring-[#40E0D0] rounded-full cursor-pointer"
                alt="userImage"
              />
              <UserDropdown user={user} isOpen={isUserOpen} />
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <Link href="/login">
              <CustomButton variant="default" className="px-9 py-3">
                Login
              </CustomButton>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
