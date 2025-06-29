import { Calendar, Images, Newspaper } from "lucide-react";
import { HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi";
import { FiPlayCircle } from "react-icons/fi";
import ActiveNavigation from "./active-navigation";
import useUser from "@/hooks/useUser";

const MainNavigation = () => {
  const user = useUser();
  const userNotExistsMenuNavigationLinks = [
    {
      icon: <Newspaper size={24} />,
      name: "Feed",
      href: "/feed",
    },
    {
      icon: <Calendar size={24} />,
      name: "Events",
      href: "/events",
    },
    {
      icon: <FiPlayCircle size={24} />,
      name: "Watch Videos",
      href: "/watch-videos",
    },
    {
      icon: <Images size={24} />,
      name: "Photo",
      href: "/photos",
    },
  ];
  const userExistsMenuNavigationLinks = [
    {
      icon: <Newspaper size={24} />,
      name: "Feed",
      href: "/feed",
    },
    {
      icon: <HiOutlineUsers size={24} />,
      name: "Connections",
      href: "/connections",
    },
    {
      icon: <HiOutlineUserGroup size={24} />,
      name: "Groups",
      href: "/groups",
    },
    {
      icon: <Calendar size={24} />,
      name: "Events",
      href: "/events",
    },
    {
      icon: <FiPlayCircle size={24} />,
      name: "Watch Videos",
      href: "/watch-videos",
    },
    {
      icon: <Images size={24} />,
      name: "Photo",
      href: "/photos",
    },
  ];
  const menuNavigationLinks = user
    ? userExistsMenuNavigationLinks
    : userNotExistsMenuNavigationLinks;
  return (
    <section className="w-full bg-white p-6 rounded-2xl">
      <div className="flex flex-col gap-6">
        {menuNavigationLinks?.map((link) => (
          <ActiveNavigation key={link.href} navLink={link} />
        ))}
      </div>
    </section>
  );
};

export default MainNavigation;
