"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
interface ActiveNavigationProps {
  icon: React.ReactNode;
  name: string;
  href: string;
}
const ActiveNavigation = ({ navLink }: { navLink: ActiveNavigationProps }) => {
  const pathName = usePathname();
  const isActive = pathName === navLink.href;
  return (
    <Link
      href={navLink.href}
      className={`flex items-center gap-4 ${isActive ? "bg-[#C4F5F0]" : "hover:bg-[#C4F5F0]"}  px-4 py-3 rounded-xl cursor-pointer transition-all duration-200`}
    >
      {navLink.icon}
      <span className="text-lg font-semibold">{navLink.name}</span>
    </Link>
  );
};

export default ActiveNavigation;
