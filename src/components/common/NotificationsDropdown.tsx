"use client";
import {
  useGetAllNotificationsQuery,
} from "@/redux/features/notifications/notificationsApi";
import { IUser } from "@/types/user.types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  receiverId: string;
  role: string;
  image: string;
  type: string;
  linkId?: string;
  viewStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DropdownProps {
  user?: IUser;
  isOpen: boolean;
}

const NotificationsDropdown: React.FC<DropdownProps> = ({ isOpen }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Extract notifications from API response
  const notifications: Notification[] = data?.data?.attributes?.results || [];


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

  // Format time difference
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Add your navigation logic here based on notification type
    console.log("Notification clicked:", notification);

    // Example navigation logic:
    // if (notification.type === "post" && notification.linkId) {
    //   router.push(`/posts/${notification.linkId}`);
    // } else if (notification.type === "connection") {
    //   router.push("/connections");
    // }
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
          className="absolute top-16 right-0 bg-white rounded-xl shadow-lg p-6 w-[min(662px,90vw)] z-50"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <button className="text-primary">Mark all as read</button>
          </div>

          <div className="space-y-3 min-h-48 max-h-[400px] scrollbar-hide overflow-y-auto">
            {isLoading ? (
              // Loading skeleton
              Array(3)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse px-4 py-3 rounded-xl flex items-center gap-4"
                  >
                    <div className="size-14 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4 cursor-pointer transition-colors ${
                    !notification.viewStatus ? "bg-[#ECFCFA]" : ""
                  }`}
                >
                  <Image
                    src={
                      notification.image ||
                      "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg"
                    }
                    width={60}
                    height={60}
                    className="size-14 rounded-full flex-shrink-0 object-cover"
                    alt="user"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`truncate ${
                        !notification.viewStatus
                          ? "font-semibold"
                          : "font-medium"
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {!notification.viewStatus && (
                      <span className="w-3 h-3 bg-primary rounded-full block"></span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Empty state
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🔔</div>
                <p className="text-sm">No notifications yet</p>
              </div>
            )}
          </div>

          <div className="mt-3 border-t border-[#E2E8F0] pt-5 flex justify-center items-center">
            <h1 className="text-primary text-sm cursor-pointer hover:underline">
              View all notifications
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsDropdown;
