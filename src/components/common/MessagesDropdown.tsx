
"use client";
import { useGetAllNotificationsQuery, useViewSingleNotificationMutation } from "@/redux/features/notifications/notificationsApi";
import { INotification } from "@/types/notification.types";
import { IUser } from "@/types/user.types";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface DropdownProps {
  user?: IUser;
  isOpen: boolean;
}

const MessagesDropdown: React.FC<DropdownProps> = ({ isOpen }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [viewSingleNotification] = useViewSingleNotificationMutation();

  // Get all message notifications
  const { data: responseData, isLoading: isNotificationsLoading } = useGetAllNotificationsQuery([
    {
      key: "page",
      value: 1,
    },
    {
      key: "limit",
      value: 10,
    },
    {
      key: "type",
      value: "message",
    },
  ]);

  const messagesNotifications = responseData?.data?.attributes?.results || [];

  // Handle click on notification card
  const handleNotificationClick = async (notification: INotification) => {
    if (!notification._id) return;

    try {
      // Call viewSingleNotification API
      const response = await viewSingleNotification(notification._id).unwrap();
      if (response) {
        // Navigate to /messages/[senderId]
        // Assuming senderId is stored in notification.linkId or can be derived
        const senderId = notification.linkId || notification.receiverId; // Adjust based on your schema
        if (senderId) {
          router.push(`/messages/${senderId}`);
        }
      }
    } catch (error) {
      console.error("Error viewing notification:", error);
      // Optionally show an error toast
    }
  };

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
            {/* <button className="text-sm text-primary">Mark all as read</button> */}
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {isNotificationsLoading ? (
              <div className="text-center text-gray-500">Loading notifications...</div>
            ) : messagesNotifications.length === 0 ? (
              <div className="text-center text-gray-500">No message notifications</div>
            ) : (
              messagesNotifications.map((notification: INotification, index: number) => (
                <div
                  key={notification._id?.toString() || index}
                  onClick={() => handleNotificationClick(notification)}
                  className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl cursor-pointer flex items-center gap-4"
                >
                  {notification?.image && (
                    <Image
                      src={notification.image}
                      width={60}
                      height={60}
                      className="size-14 rounded-full flex-shrink-0"
                      alt="user"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h1 className="font-medium truncate">{notification?.title}</h1>
                    <p className="text-sm text-gray-500">
                      {moment(notification?.createdAt).fromNow()}
                    </p>
                  </div>
                  {!notification.viewStatus && (
                    <div className="flex-shrink-0">
                      <span className="w-3 h-3 bg-primary rounded-full block"></span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="mt-3 border-t border-[#E2E8F0] pt-5 flex justify-center items-center">
            <h1
              className="text-primary text-sm cursor-pointer"
              onClick={() => router.push("/messages")}
            >
              View all messages
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessagesDropdown;