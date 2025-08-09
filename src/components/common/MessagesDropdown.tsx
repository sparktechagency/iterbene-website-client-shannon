"use client";
import {
  useGetALLMessageNotificationsQuery,
  useViewAllNotificationsMutation,
} from "@/redux/features/notifications/notificationsApi";
import { TError } from "@/types/error";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Skeleton from "../custom/custom-skeleton";
import { useRouter } from "next/navigation";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { IoMdNotificationsOutline } from "react-icons/io";

interface Notification {
  _id: string;
  title: string;
  message: string;
  senderId: string;
  receiverId: string;
  role: string;
  image?: string;
  type: string;
  linkId?: string;
  viewStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DropdownProps {
  isOpen: boolean;
  setUnviewMessageCount: React.Dispatch<React.SetStateAction<number>>;
}

const MessagesDropdown: React.FC<DropdownProps> = ({
  isOpen,
  setUnviewMessageCount,
}) => {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Notification data fetch
  const {
    data: responseData,
    isLoading,
    refetch,
  } = useGetALLMessageNotificationsQuery(
    [
      { key: "page", value: currentPage },
      { key: "limit", value: "10" },
    ],
    { refetchOnMountOrArgChange: true, skip: !isOpen }
  );
  // Mark all as read mutation
  const [viewAllNotifications] = useViewAllNotificationsMutation();

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  // Update notifications when data arrives
  useEffect(() => {
    if (responseData?.data?.attributes?.results) {
      if (currentPage === 1) {
        setAllNotifications(responseData.data.attributes.results);
      } else {
        const existingIds = new Set(allNotifications.map((n) => n._id));
        const uniqueNewNotifications =
          responseData.data.attributes.results.filter(
            (n: Notification) => !existingIds.has(n._id)
          );
        setAllNotifications((prev) => [...prev, ...uniqueNewNotifications]);
      }
    }
  }, [responseData, currentPage, allNotifications]);

  // Handle click inside dropdown
  useEffect(() => {
    const handleClickInside = (event: MouseEvent) => event.stopPropagation();
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

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === "message") {
      router.push(`/messages/${notification?.senderId}`);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const type = "message";
      await viewAllNotifications(type).unwrap();
      setUnviewMessageCount(0);
      toast.success("All notifications marked as read!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Load next page
  const handlePageChange = () => {
    if (
      responseData?.data?.attributes?.totalPages &&
      currentPage < responseData.data.attributes.totalPages
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const unviewNotificationCount = responseData?.data?.attributes?.count || 0;

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
          role="menu"
          aria-label="Notifications dropdown"
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-semibold text-lg">Messages</h3>
            {unviewNotificationCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-primary cursor-pointer"
                aria-label="Mark all as read"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="space-y-3 min-h-48 max-h-[400px] scrollbar-hide overflow-y-auto">
            {isLoading ? (
              Array(3)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse px-4 py-3 rounded-xl flex items-center gap-4"
                  >
                    <Skeleton
                      width="56px"
                      height="56px"
                      className="rounded-full"
                    />
                    <div className="flex-1 space-y-2">
                      <Skeleton
                        width="70%"
                        height="0.8rem"
                        className="rounded"
                      />
                      <Skeleton
                        width="50%"
                        height="0.4rem"
                        className="rounded"
                      />
                    </div>
                  </div>
                ))
            ) : allNotifications.length > 0 ? (
              allNotifications?.map((notification) => (
                <div
                  key={notification?._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4 cursor-pointer transition-colors ${
                    !notification.viewStatus ? "bg-[#ECFCFA]" : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleNotificationClick(notification)
                  }
                >
                  {notification?.image ? (
                    <Image
                      src={notification?.image}
                      width={40}
                      height={40}
                      className="size-[40px] rounded-full flex-shrink-0 object-cover"
                      alt="user"
                    />
                  ) : (
                    <div className="size-[40px] rounded-full bg-gray-300 flex items-center justify-center">
                      🔔
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`truncate ${
                        !notification?.viewStatus
                          ? "font-semibold"
                          : "font-medium"
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTimeAgo(notification?.createdAt)}
                    </p>
                  </div>
                  {!notification?.viewStatus && (
                    <span className="w-3 h-3 bg-primary rounded-full block" />
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <IoMdNotificationsOutline className="w-8 h-8" />
                <p className="text-sm">No messages yet</p>
              </div>
            )}
          </div>

          {allNotifications.length >= 10 &&
            responseData?.data?.attributes?.totalPages &&
            currentPage < responseData.data.attributes.totalPages && (
              <div className="mt-3 border-t border-[#E2E8F0] pt-5 flex justify-center items-center">
                <button
                  onClick={handlePageChange}
                  className="text-primary text-sm cursor-pointer hover:underline"
                  aria-label="View more notifications"
                >
                  View all messages
                </button>
              </div>
            )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessagesDropdown;
