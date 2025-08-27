"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  header?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  header,
  children,
  className = "",
  maxWidth = "max-w-2xl",
  maxHeight = "max-h-[65vh]",
  closeOnBackdropClick = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Better scroll prevention that doesn't break input functionality
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalScrollY = window.scrollY;

      // Only prevent scrolling, don't fix position
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px"; // Prevent layout shift
      document.body.classList.add("modal-open");

      // Focus trap for accessibility
      const modalElement = modalRef.current;
      const focusableElements = modalElement?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      const lastElement = focusableElements?.[
        focusableElements.length - 1
      ] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              e.preventDefault();
            }
          }
        }

        // Close modal on Escape
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleTabKey);

      // Focus first focusable element
      setTimeout(() => firstElement?.focus(), 100);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.paddingRight = "";
        document.body.classList.remove("modal-open");
        document.removeEventListener("keydown", handleTabKey);

        // Restore scroll position
        window.scrollTo(0, originalScrollY);
      };
    }
  }, [isOpen, onClose]);

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center p-2 justify-center z-50"
          style={{ touchAction: "none" }} // Prevent mobile scroll
          onClick={closeOnBackdropClick ? onClose : undefined}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className={`w-full bg-white rounded-xl ${className} shadow-2xl ${maxWidth} relative modal-content`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              duration: 0.3,
            }}
            onClick={handleModalClick}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            {header && header}

            {/* Modal Content */}
            <div
              className={`px-2 py-3 overflow-y-auto rounded-b-xl ${maxHeight}`}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;
