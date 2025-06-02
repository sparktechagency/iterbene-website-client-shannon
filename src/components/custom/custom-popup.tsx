"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Trash2, Check } from "lucide-react";

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "delete" | "warning" | "success" | "info";
  showIcon?: boolean;
  isLoading?: boolean;
  closeOnBackdropClick?: boolean;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  showIcon = true,
  isLoading = false,
  closeOnBackdropClick = true,
}) => {
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  // Get icon and colors based on type
  const getTypeConfig = () => {
    switch (type) {
      case "delete":
        return {
          icon: <Trash2 className="w-6 h-6" />,
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          confirmBg: "bg-red-600 hover:bg-red-700",
          confirmText: "text-white",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6" />,
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          confirmBg: "bg-yellow-600 hover:bg-yellow-700",
          confirmText: "text-white",
        };
      case "success":
        return {
          icon: <Check className="w-6 h-6" />,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          confirmBg: "bg-green-600 hover:bg-green-700",
          confirmText: "text-white",
        };
      case "info":
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6" />,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          confirmBg: "bg-blue-600 hover:bg-blue-700",
          confirmText: "text-white",
        };
    }
  };

  const typeConfig = getTypeConfig();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
          onClick={closeOnBackdropClick ? onClose : undefined}
        >
          <motion.div
            className="w-full max-w-md bg-white rounded-xl shadow-2xl relative"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.3,
            }}
            onClick={handleModalClick}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-gray-600 transition-colors cursor-pointer"
              onClick={onClose}
            >
              <X className="size-6" />
            </button>

            {/* Content */}
            <div className="p-6">
              {/* Icon */}
              {showIcon && (
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${typeConfig.iconBg}`}>
                    <div className={typeConfig.iconColor}>
                      {typeConfig.icon}
                    </div>
                  </div>
                </div>
              )}

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                {title}
              </h3>

              {/* Message */}
              <p className="text-gray-600 text-center mb-6">{message}</p>

              {/* Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  className="px-8 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors  cursor-pointer"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {cancelText}
                </button>
                <button
                  className={`px-8 py-3 rounded-xl font-medium transition-colors cursor-pointer  ${typeConfig.confirmBg} ${typeConfig.confirmText} disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationPopup;
