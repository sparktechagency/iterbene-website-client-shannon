"use client";
import { IConnection } from "@/types/connection.types";
import { AnimatePresence, motion } from "framer-motion";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const MyConnectionCard = ({ connection }: { connection: IConnection }) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl relative">
      <Link href={`/${connection?.username}`}>
        <div className="flex items-center space-x-4">
          <Image
            src={connection?.profileImage || "/default-avatar.png"}
            alt={connection?.fullName || "User"}
            width={70}
            height={70}
            className="w-[70px] h-[70px] rounded-full object-cover ring-2 ring-gray-300"
          />
          <div className="flex flex-col">
            <span className="text-gray-800 font-semibold text-lg">
              {connection?.fullName}
            </span>
            <span className="text-gray-600">@{connection?.username}</span>
          </div>
        </div>
      </Link>
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="text-gray-700 transition-colors cursor-pointer size-12 rounded-full flex justify-center items-center hover:bg-gray-50"
      >
        <Ellipsis size={28} />
      </button>
      {showOptions && (
        <AnimatePresence>
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute right-8 top-20 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10"
          >
            <button className="w-full text-left font-medium px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-300 rounded-t-xl cursor-pointer">
              Remove Connection
            </button>
            <button className="w-full text-left font-medium px-4 py-3 text-sm text-red-600 hover:bg-gray-100 transition-all duration-300 rounded-b-xl cursor-pointer">
              Block
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default MyConnectionCard;