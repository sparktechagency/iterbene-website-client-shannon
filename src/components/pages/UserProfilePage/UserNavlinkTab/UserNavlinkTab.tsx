"use client";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const UserNavlinkTab = ({ isMyProfile }: { isMyProfile: boolean }) => {
  const { userName } = useParams();
  const pathname = usePathname();

  const myTabs = [
    { name: "Profile", path: `/${userName}` },
    { name: "Timeline", path: `/${userName}/timeline` },
    { name: "Connections", path: `/${userName}/connections` },
    { name: "Groups", path: `/${userName}/groups` },
    { name: "Videos", path: `/${userName}/videos` },
    { name: "Photos", path: `/${userName}/photos` },
    { name: "Maps", path: `/${userName}/maps` },
    { name: "Itinerary", path: `/${userName}/itinerary` },
    { name: "Invitations", path: `/${userName}/invitations` },
    { name: "Privacy", path: `/${userName}/privacy` },
  ];

  const userTabs = [
    { name: "Profile", path: `/${userName}` },
    { name: "Timeline", path: `/${userName}/timeline` },
    { name: "Videos", path: `/${userName}/videos` },
    { name: "Photos", path: `/${userName}/photos` },
    { name: "Itinerary", path: `/${userName}/itinerary` },
  ];

  const tabs = isMyProfile ? myTabs : userTabs;

  // Find the active tab index based on the current pathname
  const activeTabIndex = tabs.findIndex((tab) => tab.path === pathname);

  return (
    <div className="bg-gray-100  border-gray-200 overflow-x-auto scrollbar-thin">
      <nav className="flex space-x-6 px-4 py-2">
        {tabs.map((tab, index) => (
          <div key={tab.name} className="relative">
            <Link href={tab.path}>
              <motion.div
                className={`text-sm font-medium pb-2 transition-colors duration-200 ${
                  pathname === tab.path
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.name}
              </motion.div>
            </Link>
            {activeTabIndex === index && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default UserNavlinkTab;
