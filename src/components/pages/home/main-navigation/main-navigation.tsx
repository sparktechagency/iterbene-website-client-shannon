import {
  CalendarArrowDown,
  File,
  Image as Images,
  Users,
  Watch,
} from "lucide-react";
import Link from "next/link";

const MainNavigation = () => {
    const user = true;
  const userNotExistsMenuNavigationLinks = [
    {
      icon: <File />,
      name: "Feed",
      href: "/feed",
    },
    {
      icon: <CalendarArrowDown />,
      name: "Events",
      href: "/events",
    },
    {
      icon: <Watch />,
      name: "Watch Videos",
      href: "/watch-videos",
    },
    {
      icon: <Images />,
      name: "Photo",
      href: "/photos",
    },
  ];
  const userExistsMenuNavigationLinks = [
    {
      icon: <File />,
      name: "Feed",
      href: "/feed",
    },
    {
      icon: <Users />,
      name: "Connections",
      href: "/connections",
    },
    {
      icon: <Users />,
      name: "Groups",
      href: "/groups",
    },
    {
      icon: <CalendarArrowDown />,
      name: "Events",
      href: "/events",
    },
    {
      icon: <Watch />,
      name: "Watch Videos",
      href: "/watch-videos",
    },
    {
      icon: <Images />,
      name: "Photo",
      href: "/photos",
    },
  ];
  const menuNavigationLinks = user ? userExistsMenuNavigationLinks : userNotExistsMenuNavigationLinks;
  return (
    <section className="w-full bg-white p-6 rounded-2xl">
      <div className="flex flex-col gap-6">
        {menuNavigationLinks?.map((link) => (
          <Link href={link.href} className="flex items-center gap-4 hover:bg-[#C4F5F0] px-4 py-3 rounded-xl cursor-pointer transition-all duration-200" key={link.name}>
            {link.icon}
            <span className="text-lg font-semibold">{link.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MainNavigation;
