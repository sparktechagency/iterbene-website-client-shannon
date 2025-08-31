import { IUser } from "@/types/user.types";
import { LucideCalendarCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { FaRegCalendarAlt, FaRegUserCircle } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoChatboxEllipsesOutline, IoSettingsOutline } from "react-icons/io5";
import { MdAlternateEmail } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import SettingsDropdown from "./SettingsDropdown";
import { performLogout } from "@/utils/logoutManager";
interface DropdownProps {
  user?: IUser;
  isOpen: boolean;
}
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

  const handleLogout = async () => {
    await performLogout(router, "/login");
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
          className="absolute  top-16 right-0 bg-white rounded-xl shadow-md p-6 w-[min(430px,90vw)] z-50"
        >
          <Link href={`/${user?.username}`}>
            <div className="flex items-center gap-3 mb-4 bg-[#ECFCFA] p-4 rounded-xl">
              {user?.profileImage && (
                <Image
                  src={user?.profileImage}
                  width={40}
                  height={40}
                  className="size-13 rounded-full flex-shrink-0"
                  alt="user"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{`${user?.firstName} ${user?.lastName}`}</p>
                <p className="text-sm text-gray-500 truncate">
                  @{user?.username}
                </p>
              </div>
            </div>
          </Link>
          <div className="space-y-3 min-h-48 max-h-[400px] overflow-y-auto ">
            <Link
              href={`/${user?.username}`}
              className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
            >
              <FaRegUserCircle size={24} />
              <span>My Profile</span>
            </Link>
            <Link
              href={`/${user?.username}/timeline`}
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
            </Link>
            <Link
              href="/groups"
              className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
            >
              <HiOutlineUserGroup size={24} />
              <span>Groups</span>
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
                onMouseEnter={toggleSettings}
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

export default UserDropdown;
