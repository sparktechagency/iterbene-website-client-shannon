"use client";
import { Home, MessageCircle, Bell, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import { HiOutlineUserGroup } from "react-icons/hi";

const MobileBottomNavigation = () => {
  const pathname = usePathname();
  const user = useUser();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  const navigationItems = [
    {
      icon: <HiOutlineUserGroup size={24} />,
      href: "/groups",
      isActive: pathname === "/groups",
    },
    {
      icon: <Home size={22} />,
      href: "/feed",
      isActive: pathname === "/feed" || pathname === "/",
    },
    {
      icon: <MessageCircle size={22} />,
      href: "/messages",
      isActive: pathname.startsWith("/messages"),
    },
    {
      icon: <Bell size={22} />,
      href: "/notifications",
      isActive: pathname === "/notifications",
    },
  ];

  if (user) {
    navigationItems.splice(1, 0, {
      icon: <Users size={22} />,
      href: "/connections",
      isActive: pathname === "/connections",
    });
  }

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 transition-transform duration-300 z-50 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item, index) => (
          <Link
            key={index + 1}
            href={item.href}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              item.isActive
                ? "text-primary bg-blue-50"
                : "text-gray-600  hover:bg-gray-50"
            }`}
          >
            <div className="mb-1">{item.icon}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNavigation;
