"use client";
import { useSocket } from "@/lib/socket";
import {
  useGetAllNotificationsQuery,
  useViewSingleNotificationMutation,
} from "@/redux/features/notifications/notificationsApi";
import { INotification } from "@/types/notification.types";
import { IUser } from "@/types/user.types";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Skeleton from "../custom/custom-skeleton";

interface DropdownProps {
  user?: IUser;
  isOpen: boolean;
}

const MessagesDropdown: React.FC<DropdownProps> = ({ isOpen, user }) => {
  const { socket } = useSocket();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [viewSingleNotification] = useViewSingleNotificationMutation();

  // Get all message notifications
  const {
    data: responseData,
    isLoading: isNotificationsLoading,
    refetch,
  } = useGetAllNotificationsQuery(
    [
      { key: "page", value: 1 },
      { key: "limit", value: 10 },
      { key: "type", value: "message" },
    ],
    {
      skip: !isOpen,
    }
  );

  // Local state to manage notifications
  const [localNotifications, setLocalNotifications] = useState<INotification[]>(
    responseData?.data?.attributes?.results || []
  );

  // Sync local state with fetched data
  useEffect(() => {
    if (responseData?.data?.attributes?.results) {
      setLocalNotifications(responseData.data.attributes.results);
    }
  }, [responseData]);

  // Handle click on notification card
  const handleNotificationClick = async (notification: INotification) => {
    if (!notification._id) return;

    try {
      const response = await viewSingleNotification(notification._id).unwrap();
      if (response) {
        const senderId = notification.linkId || notification.receiverId;
        if (senderId) {
          router.push(`/messages/${senderId}`);
        }
      }
    } catch (error) {
      console.error("Error viewing notification:", error);
    }
  };

  // Handle socket notifications
  useEffect(() => {
    if (socket && user?._id) {
      const notificationEvent = `message-notification::${user._id}`;
      const handleNotification = (notificationData: {
        data: INotification;
      }) => {
        const notification = notificationData.data;
        if (notification.type === "message") {
          // Add new notification to local state
          setLocalNotifications((prev) => [notification, ...prev]);
          toast.success(notification?.title);
          // Optionally trigger refetch to sync with server
          refetch();
        }
      };

      socket.on(notificationEvent, handleNotification);

      return () => {
        socket.off(notificationEvent, handleNotification);
      };
    }
  }, [socket, user, refetch]);

  // Prevent dropdown from closing when clicking inside
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
            <h3 className="font-semibold text-lg">Messages</h3>
          </div>
          <div
            className={`flex flex-col ${
              localNotifications?.length > 0
                ? "justify-start"
                : "justify-center"
            } gap-3 min-h-48 max-h-[400px] scrollbar-hide overflow-y-auto`}
          >
            {isNotificationsLoading ? (
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
            ) : localNotifications?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🔔</div>
                <p className="text-sm">No message notifications yet</p>
              </div>
            ) : (
              localNotifications?.map(
                (notification: INotification, index: number) => (
                  <div
                    key={notification._id?.toString() || index}
                    onClick={() => handleNotificationClick(notification)}
                    className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl cursor-pointer flex items-center gap-4"
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
                      <h1 className="font-medium truncate">
                        {notification?.title}
                      </h1>
                      <p className="text-sm text-gray-500">
                        {moment(notification?.createdAt).fromNow()}
                      </p>
                    </div>
                    {!notification?.viewStatus && (
                      <div className="flex-shrink-0">
                        <span className="w-3 h-3 bg-primary rounded-full block"></span>
                      </div>
                    )}
                  </div>
                )
              )
            )}
          </div>
          {localNotifications?.length > 4 && (
            <div className="mt-3 border-t border-[#E2E8F0] pt-5 flex justify-center items-center">
              <h1
                className="text-primary text-sm cursor-pointer"
                onClick={() => router.push("/messages")}
              >
                View all messages
              </h1>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessagesDropdown;
