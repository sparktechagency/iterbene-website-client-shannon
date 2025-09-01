import { IUser } from "@/types/user.types";
import {
  BadgeInfo,
  BookKey,
  LucideCalendarCheck,
  ShieldAlert,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { BiLogOut } from "react-icons/bi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoChatboxEllipsesOutline, IoSettingsOutline } from "react-icons/io5";
import { MdAlternateEmail } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
interface DropdownProps {
  user?: IUser;
  isOpen: boolean;
  setIsUserOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const UserDropdown: React.FC<DropdownProps> = ({
  user,
  isOpen,
  setIsUserOpen,
}) => {
  const router = useRouter();
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

  const handleLogout = async () => {
    router.push("/login");
    setIsUserOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-0 bg-white rounded-xl shadow-lg border border-gray-200 w-[min(420px,90vw)] z-50 max-h-[80vh] overflow-hidden"
            role="menu"
            aria-label="User menu dropdown"
          >
            {/* User Profile Section */}
            <Link
              href={`/${user?.username}`}
              onClick={() => setIsUserOpen(false)}
            >
              <div className="px-4 py-3 bg-primary/5 border-b border-gray-100 hover:bg-primary/10 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  {user?.profileImage ? (
                    <Image
                      src={user?.profileImage}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {`${user?.firstName} ${user?.lastName}`}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      View your profile
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Content */}
            <div className="max-h-[400px] overflow-y-auto">
              <div className="divide-y divide-gray-100">
                <Link
                  href={`/${user?.username}/timeline`}
                  onClick={() => setIsUserOpen(false)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3"
                >
                  <div className="flex-shrink-0 pt-1">
                    <LucideCalendarCheck className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium">
                      Timeline
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      View your timeline
                    </p>
                  </div>
                </Link>

                <Link
                  href="/messages"
                  onClick={() => setIsUserOpen(false)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3"
                >
                  <div className="flex-shrink-0 pt-1">
                    <IoChatboxEllipsesOutline className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium">
                      Messages
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Chat with friends
                    </p>
                  </div>
                </Link>

                <Link
                  href="/groups"
                  onClick={() => setIsUserOpen(false)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3"
                >
                  <div className="flex-shrink-0 pt-1">
                    <HiOutlineUserGroup className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium">Groups</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Join communities
                    </p>
                  </div>
                </Link>

                <Link
                  href={`/${user?.username}/maps`}
                  onClick={() => setIsUserOpen(false)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3"
                >
                  <div className="flex-shrink-0 pt-1">
                    <FiMapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium">Maps</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Explore locations
                    </p>
                  </div>
                </Link>

                <Link
                  href="/events"
                  onClick={() => setIsUserOpen(false)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3"
                >
                  <div className="flex-shrink-0 pt-1">
                    <FaRegCalendarAlt className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium">Events</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Discover events
                    </p>
                  </div>
                </Link>

                <Link
                  href={`/${user?.username}/invitations`}
                  onClick={() => setIsUserOpen(false)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3"
                >
                  <div className="flex-shrink-0 pt-1">
                    <MdAlternateEmail className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium">
                      Invitations
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Manage invites
                    </p>
                  </div>
                </Link>

                <div className="relative">
                  <button className="w-full px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3 text-left">
                    <div className="flex-shrink-0 pt-1">
                      <IoSettingsOutline className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 text-sm font-medium">
                        Settings
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Account preferences
                      </p>
                    </div>
                  </button>
                </div>
                {/* about us */}
                <Link
                  href="/about-us"
                  onClick={() => setIsUserOpen(false)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3"
                >
                  <div className="flex-shrink-0 pt-1">
                    <BadgeInfo className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium">About</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Learn more about us
                    </p>
                  </div>
                </Link>
                {/* Terms and conditions */}
                <Link
                  href="/terms-and-conditions"
                  onClick={() => setIsUserOpen(false)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3"
                >
                  <div className="flex-shrink-0 pt-1">
                    <ShieldAlert className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium">
                      Terms and conditions
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Read our terms and conditions
                    </p>
                  </div>
                </Link>

                {/* Privacy policy */}
                <Link
                  href="/privacy-policy"
                  onClick={() => setIsUserOpen(false)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3"
                >
                  <div className="flex-shrink-0 pt-1">
                    <BookKey className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium">
                      Privacy policy
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Read our privacy policy
                    </p>
                  </div>
                </Link>

                {/* Logout */}

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 hover:bg-red-50 cursor-pointer transition-colors flex items-start gap-3 text-left text-red-500"
                >
                  <div className="flex-shrink-0 pt-1">
                    <BiLogOut className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Logout</p>
                    <p className="text-xs text-red-400 mt-0.5">
                      Sign out of your account
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserDropdown;
