"use client";
import {
  useGetAllNotificationsQuery,
  useViewAllNotificationsMutation,
  useViewSingleNotificationMutation,
} from "@/redux/features/notifications/notificationsApi";
import { TError } from "@/types/error";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Skeleton from "../../custom/custom-skeleton";
import formatTimeAgo from "@/utils/formatTimeAgo";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useRouter } from "next/navigation";
import { Bell, Check, CheckCheck, RefreshCw } from "lucide-react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { INotification } from "@/types/notification.types";

const NotificationsPage = () => {
  const [allNotifications, setAllNotifications] = useState<INotification[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  // Notification data fetch
  const {
    data: responseData,
    isLoading,
    isFetching,
    refetch: refetchNotifications,
  } = useGetAllNotificationsQuery([
    { key: "page", value: currentPage.toString() },
    { key: "limit", value: "20" },
  ]);

  // Mutations
  const [viewAllNotifications, { isLoading: markingAllAsRead }] =
    useViewAllNotificationsMutation();
  const [viewSingleNotification] = useViewSingleNotificationMutation();

  // Update notifications when data arrives
  useEffect(() => {
    if (responseData?.data?.attributes?.results) {
      if (currentPage === 1) {
        setAllNotifications(responseData?.data?.attributes?.results);
      } else {
        setAllNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n._id));
          const uniqueNewNotifications =
            responseData?.data?.attributes?.results.filter(
              (n: INotification) => !existingIds.has(n._id)
            );
          return [...prev, ...uniqueNewNotifications];
        });
      }
    }
  }, [responseData, currentPage]);

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
    rootMargin: "100px",
  });

  // Handle notification click
  const handleNotificationClick = useCallback(
    async (notification: INotification) => {
      // Mark as read if not already viewed
      if (!notification.viewStatus) {
        try {
          await viewSingleNotification(notification._id).unwrap();
          setAllNotifications((prev) =>
            prev.map((n) =>
              n._id === notification._id ? { ...n, viewStatus: true } : n
            )
          );
        } catch (error) {
          console.error("Failed to mark notification as read:", error);
        }
      }

      // Navigate based on notification type
      if (notification.type === "post") {
        router.push(`/feed/${notification?.linkId}`);
      } else if (notification.type === "story") {
        router.push(`/journey/${notification?.linkId}`);
      } else if (notification.type === "group") {
        router.push(`/groups/${notification?.linkId}`);
      } else if (notification.type === "connection") {
        router.push(`/connections`);
      } else if (notification.type === "message") {
        router.push(`/messages/${notification?.linkId}`);
      } else if (notification.type === "event") {
        router.push(`/events/${notification?.linkId}`);
      } else if (notification.type === "comment") {
        router.push(`/feed/${notification?.linkId}`);
      }
    },
    [viewSingleNotification, router]
  );

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await viewAllNotifications(undefined).unwrap();
      setAllNotifications((prev) =>
        prev.map((n) => ({ ...n, viewStatus: true }))
      );
      toast.success("All notifications marked as read!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

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

  // Get unread notifications count
  const unreadCount = allNotifications?.filter((n) => !n.viewStatus)?.length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-[70px] lg:top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500">
                    {unreadCount} unread notification
                    {unreadCount !== 1 ? "s" : ""}
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
                <RefreshCw className="w-5 h-5" />
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={markingAllAsRead}
                  className="flex items-center gap-2 px-3 py-2 lg:px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
                >
                  {markingAllAsRead ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCheck className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Mark all as read</span>
                  <span className="sm:hidden">Mark all</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {isLoading && currentPage === 1 ? (
          // Initial loading skeleton
          <div className="space-y-4">
            {Array(8)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 shadow-sm animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton
                      width="48px"
                      height="48px"
                      className="rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <Skeleton width="70%" height="1rem" className="rounded" />
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
                </div>
              ))}
          </div>
        ) : allNotifications?.length > 0 ? (
          <div className="space-y-2">
            {allNotifications?.map((notification, index) => (
              <div
                key={notification._id}
                ref={
                  index === allNotifications?.length - 1 ? lastElementRef : null
                }
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-lg p-3 lg:p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 active:scale-[0.99] ${
                  !notification.viewStatus
                    ? "border-l-primary bg-primary/5"
                    : "border-l-transparent"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar or Icon */}
                  <div className="flex-shrink-0">
                    {notification?.image ? (
                      <Image
                        src={notification.image}
                        width={40}
                        height={40}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                        alt="Notification avatar"
                      />
                    ) : (
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-lg lg:text-xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-gray-900 leading-relaxed ${
                            !notification.viewStatus
                              ? "font-semibold"
                              : "font-medium"
                          }`}
                        >
                          {notification.title}
                        </p>
                        {notification.message && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                            {notification.type}
                          </span>
                        </div>
                      </div>

                      {/* Read status indicator */}
                      <div className="flex-shrink-0">
                        {!notification.viewStatus ? (
                          <div className="w-3 h-3 bg-primary rounded-full" />
                        ) : (
                          <Check className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading more indicator */}
            {isFetching && hasMore && currentPage > 1 && (
              <div className="flex justify-center py-6">
                <div className="flex items-center gap-2 text-gray-500">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading more notifications...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <IoMdNotificationsOutline className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications yet
            </h3>
            <p className="text-sm text-center max-w-sm">
              When you have new notifications, they&apos;ll appear here. Stay
              tuned for updates!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
