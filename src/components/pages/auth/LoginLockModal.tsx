"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Lock, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import moment from "moment";

interface LoginLockModalProps {
  isVisible: boolean;
  lockUntil: string | Date;
  lockTime: number; // in minutes
  onClose: () => void;
}

const LoginLockModal: React.FC<LoginLockModalProps> = ({
  isVisible,
  lockUntil,
  lockTime,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(true);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset body overflow
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  useEffect(() => {
    if (!lockUntil) return;

    const calculateTimeRemaining = () => {
      const now = moment();
      const lockUntilMoment = moment(lockUntil);
      const remaining = lockUntilMoment.diff(now, "seconds");

      if (remaining <= 0) {
        setIsLocked(false);
        return 0;
      }

      return remaining;
    };

    // Initial calculation
    const initialRemaining = calculateTimeRemaining();
    setTimeRemaining(initialRemaining);

    // If already unlocked, don't start timer
    if (initialRemaining <= 0) {
      setIsLocked(false);
      return;
    }

    // Set up interval to update countdown
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        setIsLocked(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockUntil]);

  const formatTime = (seconds: number) => {
    const duration = moment.duration(seconds, "seconds");
    const minutes = Math.floor(duration.asMinutes());
    const remainingSeconds = duration.seconds();

    if (minutes > 0) {
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `00:${remainingSeconds.toString().padStart(2, "0")}`;
    }
  };

  const getTimeDisplay = () => {
    const duration = moment.duration(timeRemaining, "seconds");

    if (duration.asMinutes() >= 1) {
      return {
        time: formatTime(timeRemaining),
        unit: "minutes",
      };
    } else {
      return {
        time: `${Math.ceil(duration.asSeconds())}`,
        unit: "seconds",
      };
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClose = () => {
    if (!isLocked) {
      onClose();
    }
  };

  const lockStartTime = moment(lockUntil).subtract(lockTime, "minutes");
  const timeDisplay = getTimeDisplay();

  const modalContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={isLocked ? undefined : onClose}
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
            {/* Close button - only visible when unlocked */}
            {!isLocked && (
              <button
                className="absolute top-4 right-4 text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center hover:bg-gray-100 transition-colors"
                onClick={handleClose}
              >
                <IoMdClose size={18} />
              </button>
            )}

            {/* Content */}
            <div className="p-6 text-center">
              {/* Icon */}
              <div className="mb-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isLocked ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  {isLocked ? (
                    <Lock className="w-8 h-8 text-red-500" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-green-500" />
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {isLocked ? "Account Temporarily Locked" : "Account Unlocked"}
                </h3>
              </div>

              {/* Message Content */}
              <div className="mb-6">
                {isLocked ? (
                  <>
                    <p className="text-gray-600 mb-2">
                      Your account has been locked for{" "}
                      <strong>{lockTime} minute</strong> due to multiple failed
                      login attempts.
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Locked since: {lockStartTime.format("h:mm A")}
                    </p>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-sm text-red-600 font-medium">
                          Time Remaining
                        </span>
                      </div>

                      {timeDisplay.unit === "minutes" ? (
                        <div className="text-3xl font-bold text-red-600 font-mono">
                          {timeDisplay.time}
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-red-600">
                          {timeDisplay.time} seconds
                        </div>
                      )}

                      <p className="text-sm text-red-500 mt-2">
                        Please wait until the timer expires to try again
                      </p>

                      <div className="mt-3 text-xs text-gray-500">
                        Unlock time: {moment(lockUntil).format("h:mm A")}
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 mt-4">
                      This is a security measure to protect your account
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 mb-4">
                      The lock period has expired. You can now try to login again.
                    </p>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-green-600 font-medium mb-2">
                        ✅ Account Unlocked
                      </div>
                      <p className="text-sm text-green-600">
                        Unlocked at: {moment().format("h:mm A")}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Action Button - only visible when unlocked */}
              {!isLocked && (
                <button
                  onClick={handleClose}
                  className="w-full bg-primary hover:bg-primary/90 cursor-pointer text-white py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  Try Login Again
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Only render portal on client side
  if (!mounted) return null;

  // Create portal to render modal outside of current DOM hierarchy
  return createPortal(modalContent, document.body);
};

export default LoginLockModal;