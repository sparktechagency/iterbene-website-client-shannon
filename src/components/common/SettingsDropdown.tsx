import { IUser } from "@/types/user.types";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
interface DropdownProps {
  user?: IUser;
  isOpen: boolean;
}
const SettingsDropdown: React.FC<DropdownProps> = ({ isOpen }) => {

  console.log("Setting Open", isOpen);
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
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-1 left-[-228px] rounded-xl p-3.5 w-[228px] z-50"
        >
          <div className="space-y-3">
            <Link
              href="/about-us"
              className="text-gray-800 hover:bg-[#ECFCFA] p-3 rounded-xl flex items-center gap-4 text-sm"
            >
              About Us
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-gray-800 hover:bg-[#ECFCFA] p-3 rounded-xl flex items-center gap-4 text-sm"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="text-gray-800 hover:bg-[#ECFCFA] p-3 rounded-xl flex items-center gap-4 text-sm"
            >
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default SettingsDropdown;