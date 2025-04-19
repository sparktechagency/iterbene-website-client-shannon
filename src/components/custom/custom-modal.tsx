"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  header?: React.ReactNode; // Optional title for the modal
  children: React.ReactNode; // Content of the modal
  maxWidth?: string; // Optional max width for the modal
  maxHeight?: string; // Optional max height for the modal
  showCloseButton?: boolean; // Option to show/hide the close button
  closeOnBackdropClick?: boolean; // Option to close modal on backdrop click
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  header,
  children,
  maxWidth = "max-w-2xl",
  maxHeight = "max-h-[80vh]",
  closeOnBackdropClick = true,
}) => {
  // Prevent background scrolling and apply blur when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px"
    } else {
      document.body.style.overflow = "auto"; 
      document.body.style.paddingRight = "0";
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="w-full h-screen bg-black/70 fixed inset-0 flex items-center justify-center z-50 p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeOnBackdropClick ? onClose : undefined} // Close on backdrop click if enabled
        >
          <motion.div
            className={`w-full bg-white rounded-xl shadow-2xl ${maxWidth}  relative`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            {header ? (
              header
            ) : (
              <div className="flex items-center justify-between p-6 border-b border-gray-200 rounded-t-xl">
                <h2 className="text-lg font-semibold">{header}</h2>
                <button
                  className="text-gray-600 hover:text-gray-800 cursor-pointer"
                  onClick={onClose}
                >
                  <IoClose size={24} />
                </button>
              </div>
            )}

            {/* Modal Content */}
            <div className={`p-6 overflow-y-auto rounded-b-xl  ${maxHeight}`}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;
