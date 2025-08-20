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
import { MessageCircle, Check, CheckCheck, RefreshCw } from "lucide-react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { INotification } from "@/types/notification.types";
interface DropdownProps {
  isOpen: boolean;
  setUnviewMessageCount: React.Dispatch<React.SetStateAction<number>>;
}

const EnhancedMessagesDropdown: React.FC<DropdownProps> = ({
  isOpen,
  setUnviewMessageCount,
}) => {
  const [allNotifications, setAllNotifications] = useState<INotification[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Notification data fetch
  const {
    data: responseData,
    isLoading,
    isFetching,
    refetch,
  } = useGetALLMessageNotificationsQuery(
    [
      { key: "page", value: currentPage },
      { key: "limit", value: "8" },
    ],
    { refetchOnMountOrArgChange: true, skip: !isOpen }
  );

  // Mark all as read mutation
  const [viewAllNotifications, { isLoading: markingAllAsRead }] = useViewAllNotificationsMutation();

  const unviewNotificationCount = responseData?.data?.attributes?.count || 0;

  useEffect(() => {
    setUnviewMessageCount(unviewNotificationCount);
  }, [unviewNotificationCount, setUnviewMessageCount]);

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setAllNotifications([]);
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
            (n: INotification) => !existingIds.has(n._id)
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
  const handleNotificationClick = (notification: INotification) => {
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
      setAllNotifications(prev => 
        prev.map(n => ({ ...n, viewStatus: true }))
      );
      toast.success("All message notifications marked as read!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
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
    onLoadMore: () => setCurrentPage(prev => prev + 1),
    threshold: 0.1,
    rootMargin: '50px'
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
          aria-label="Messages dropdown"
        >
          {/* Header */}
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Messages</h3>
                  {unviewNotificationCount > 0 && (
                    <p className="text-sm text-gray-500">
                      {unviewNotificationCount} unread
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => refetch()}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                
                {unviewNotificationCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={markingAllAsRead}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                    aria-label="Mark all as read"
                  >
                    {markingAllAsRead ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCheck className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Mark all</span>
                  </button>
                )}
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
            ) : allNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {allNotifications?.map((notification, index) => (
                  <div
                    key={notification?._id}
                    ref={index === allNotifications.length - 1 ? lastElementRef : null}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3 ${
                      !notification.viewStatus ? "bg-primary/5 border-l-4 border-l-primary" : ""
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleNotificationClick(notification)
                    }
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {notification?.image ? (
                        <Image
                          src={notification?.image}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                          alt="Message avatar"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-lg">
                          ✉️
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
                            {notification.title}
                          </p>
                          {notification.message && (
                            <p className="text-gray-600 text-xs mt-1 line-clamp-1">
                              {notification.message}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              message
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
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">No message notifications</h4>
                <p className="text-sm text-center max-w-xs">
                  When you receive new messages, notifications will appear here.
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
        
          {/* View All Button */}
          <div className="border-t border-gray-200 p-3">
            <button
              onClick={() => router.push('/messages')}
              className="w-full bg-primary text-white cursor-pointer text-sm font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              View all messages
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedMessagesDropdown;