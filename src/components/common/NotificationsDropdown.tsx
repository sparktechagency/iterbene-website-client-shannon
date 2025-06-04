import { IUser } from "@/types/user.types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
interface DropdownProps {
  user?: IUser;
  isOpen: boolean;
}

const NotificationsDropdown: React.FC<DropdownProps> = ({ isOpen }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

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
            <h3 className="font-semibold text-lg">Notifications</h3>
            <button className="text-sm text-primary">Mark all as read</button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {Array(6)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className="text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl flex items-center gap-4"
                >
                  <Image
                    src="https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg"
                    width={60}
                    height={60}
                    className="size-14 rounded-full flex-shrink-0"
                    alt="user"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {index % 2 === 0
                        ? "Your password was changed"
                        : "Alexandra Brooke sent you a connection request"}
                    </p>
                    <p className="text-sm text-gray-500">1 week ago</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="w-3 h-3 bg-primary rounded-full block"></span>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-3 border-t border-[#E2E8F0] pt-5 flex justify-center items-center">
            <h1 className="text-primary text-sm cursor-pointer">
              View all notifications
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationsDropdown;
