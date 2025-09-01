"use client";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import {
  useGetAllNotificationsQuery
} from "@/redux/features/notifications/notificationsApi";
import { INotification } from "@/types/notification.types";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import Skeleton from "../custom/custom-skeleton";

interface DropdownProps {
  isOpen: boolean;
  setIsNotificationsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

// Get notification icon based on type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "post":
      return "📝";
    case "story":
      return "📖";
    case "comment":
      return "💬";
    case "event":
      return "📅";
    case "group":
      return "👥";
    case "connection":
      return "🤝";
    case "message":
      return "✉️";
    default:
      return "🔔";
  }
};

const NotificationsDropdown: React.FC<DropdownProps> = ({
  isOpen,
  setIsNotificationsOpen
}) => {
  const [allNotifications, setAllNotifications] = useState<INotification[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Notification data fetch
  const {
    data: responseData,
    isLoading,
    isFetching,
    refetch: refetchNotifications,
  } = useGetAllNotificationsQuery(
    [
      { key: "page", value: currentPage },
      { key: "limit", value: "8" },
    ],
    { refetchOnMountOrArgChange: true, skip: !isOpen }
  );

  // Memoize unviewNotificationCount
  const unviewNotificationCount = useMemo(
    () => responseData?.data?.attributes?.count || 0,
    [responseData]
  );

  // Refetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setAllNotifications([]);
      refetchNotifications();
    }
  }, [isOpen, refetchNotifications]);

  // Update notifications when data arrives
  useEffect(() => {
    if (responseData?.data?.attributes?.results) {
      if (currentPage === 1) {
        setAllNotifications(responseData.data.attributes.results);
      } else {
        setAllNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n._id));
          const uniqueNewNotifications =
            responseData.data.attributes.results.filter(
              (n: INotification) => !existingIds.has(n._id)
            );
          return [...prev, ...uniqueNewNotifications];
        });
      }
    }
  }, [responseData, currentPage]);

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
  const handleNotificationClick = (notification: INotification) => {
    if (notification.type === "connection") {
      router.push(`/${notification?.username}`);
    }
    if (notification.type === "post") {
      router.push(`/feed/${notification?.linkId}`);
    } else if (notification.type === "story") {
      router.push(`/journey/${notification?.linkId}`);
    } else if (notification.type === "group") {
      router.push(`/groups/${notification?.linkId}`);
    } else if (notification.type === "message") {
      router.push(`/messages/${notification?.linkId}`);
    } else if (notification.type === "event") {
      router.push(`/events/${notification?.linkId}`);
    } else if (notification.type === "comment") {
      router.push(`/feed/${notification?.linkId}`);
    }
  };


  // Handle View All Notifications - Fixed navigation issue
  const handleViewAllNotifications = async () => {
    try {
      router.push("/notifications");
      setIsNotificationsOpen((prev) => !prev);
    } catch (error) {
      console.error("Error navigating to notifications page:", error);
    }
  };

  // Update hasMore state
  useEffect(() => {
    const totalPages = responseData?.data?.attributes?.totalPages || 0;
    setHasMore(currentPage < totalPages);
  }, [currentPage, responseData]);

  // Infinite scroll hook
  const { lastElementRef } = useInfiniteScroll({
    isLoading,
    isFetching,
    hasMore,
    onLoadMore: () => setCurrentPage((prev) => prev + 1),
    threshold: 0.1,
    rootMargin: "50px",
  });

  return (
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
          aria-label="Notifications dropdown"
        >
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Notifications
                  </h3>
                  {unviewNotificationCount > 0 && (
                    <p className="text-sm text-gray-500">
                      {unviewNotificationCount} unread
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => refetchNotifications()}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-4">
                {Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <Skeleton
                        width="40px"
                        height="40px"
                        className="rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 space-y-2">
                        <Skeleton
                          width="70%"
                          height="0.875rem"
                          className="rounded"
                        />
                        <Skeleton
                          width="50%"
                          height="0.75rem"
                          className="rounded"
                        />
                      </div>
                      <Skeleton
                        width="12px"
                        height="12px"
                        className="rounded-full"
                      />
                    </div>
                  ))}
              </div>
            ) : allNotifications?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {allNotifications?.map((notification, index) => (
                  <div
                    key={notification?._id}
                    ref={
                      index === allNotifications.length - 1
                        ? lastElementRef
                        : null
                    }
                    onClick={() => handleNotificationClick(notification)}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      handleNotificationClick(notification)
                    }
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3 ${
                      !notification.viewStatus
                        ? "bg-primary/5 border-l-4 border-l-primary"
                        : ""
                    }`}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {notification?.image ? (
                        <Image
                          src={notification?.image}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                          alt="Notification avatar"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-lg">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-gray-900 text-sm leading-relaxed line-clamp-2 ${
                              !notification.viewStatus
                                ? "font-semibold"
                                : "font-medium"
                            }`}
                          >
                            {notification?.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              {notification.type}
                            </span>
                          </div>
                        </div>

                        {/* Read status */}
                        <div className="flex-shrink-0">
                          {!notification.viewStatus ? (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          ) : (
                            <Check className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <IoMdNotificationsOutline className="w-8 h-8" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">
                  No notifications yet
                </h4>
                <p className="text-sm text-center max-w-xs">
                  When you have new notifications, they&apos;ll appear here.
                </p>
              </div>
            )}

            {/* Loading more indicator */}
            {isFetching && !isLoading && (
              <div className="flex justify-center py-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading more...</span>
                </div>
              </div>
            )}
          </div>

          {/* View All Button - Fixed */}
          <div className="border-t border-gray-200 p-3">
            <button
              onClick={handleViewAllNotifications}
              className="w-full bg-primary cursor-pointer text-white text-sm font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <span>View all notifications</span>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                →
              </motion.div>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsDropdown;
