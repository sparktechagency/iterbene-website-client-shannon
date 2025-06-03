"use client";
import ConfirmationPopup from "@/components/custom/custom-popup";
import { useBlockUserMutation } from "@/redux/features/blockUser/blockUserApi";
import { useRemoveConnectionMutation } from "@/redux/features/connections/connectionsApi";
import { IConnection } from "@/types/connection.types";
import { TError } from "@/types/error";
import { AnimatePresence, motion } from "framer-motion";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

const MyConnectionCard = ({ connection }: { connection: IConnection }) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isRemoveConnectionPopup, setRemoveConnectionPopup] =
    useState<boolean>(false);
  const [isBlockUserPopup, setBlockUserPopup] = useState<boolean>(false);
  // Remove Connection Mutation
  const [removeConnection, { isLoading: isRemovingConnection }] =
    useRemoveConnectionMutation();
  //block connection
  const [blockUser, { isLoading: isBlockingUser }] = useBlockUserMutation();

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

  // Remove Connection handle function
  const handleRemoveConnection = () => {
    setShowOptions(false);
    setRemoveConnectionPopup(true);
  };
  const handleConfirmRemoveConnection = async () => {
    try {
      await removeConnection(connection?._id).unwrap();
      toast.success("Remove connection successfully");
      setBlockUserPopup(false);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong");
    }
  };
  // Block user
  const handleBlockUser = () => {
    setShowOptions(false);
    setBlockUserPopup(true);
  };
  const handleConfirmBlockUser = async () => {
    try {
      await blockUser(connection?._id).unwrap();
      toast.success("Block User Successfully");
      setBlockUserPopup(false);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-xl relative">
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
            className="absolute right-5 top-20 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
          >
            <button
              onClick={handleRemoveConnection}
              className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-t-xl cursor-pointer"
            >
              Remove Connection
            </button>
            <button
              onClick={handleBlockUser}
              className="block w-full text-left px-4 py-3 text-rose-500 hover:bg-gray-100 rounded-b-xl cursor-pointer"
            >
              Block
            </button>
          </motion.div>
        </AnimatePresence>
      )}
      {/* Remove connection popup */}
      <ConfirmationPopup
        isOpen={isRemoveConnectionPopup}
        onClose={() => setRemoveConnectionPopup(false)}
        onConfirm={handleConfirmRemoveConnection}
        type="delete"
        title="Remove Connection"
        message="Are you sure you want to remove connection? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        isLoading={isRemovingConnection}
      />
      {/* Block  */}
      <ConfirmationPopup
        isOpen={isBlockUserPopup}
        onClose={() => setBlockUserPopup(false)}
        onConfirm={handleConfirmBlockUser}
        type="delete"
        title="Block User"
        message="Are you sure you want to block this user? This action cannot be undone."
        confirmText="Yes"
        cancelText="No"
        isLoading={isBlockingUser}
      />
    </div>
  );
};

export default MyConnectionCard;
