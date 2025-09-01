"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import useUser from "@/hooks/useUser";
import { closeAuthModal } from "@/redux/features/auth/authModalSlice";
import Image from "next/image";
import { X } from "lucide-react";
import logo from "@/asset/logo/logo.png";
import { useRouter } from "next/navigation";
import { getBooleanCookie, COOKIE_NAMES } from "@/utils/cookies";

const AuthModal = () => {
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(
    (state: RootState) => state.authModal.showAuthModal
  );
  const isAuthenticated = useUser();
  const [isClient, setIsClient] = useState<boolean>(false);
  const router = useRouter();
  // Using direct imports

  // Get verification status reactively from cookies
  const isVerified = getBooleanCookie(COOKIE_NAMES.ITER_BENE_VERIFIED);

  // Check if client-side and migration
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      // Reset modal state on app initialization to avoid hydration issues
      dispatch(closeAuthModal());
    }
  }, [dispatch]);

  // Handle body overflow and prevent scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyPosition = document.body.style.position;
      const originalScrollY = window.scrollY;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${originalScrollY}px`;
      document.body.style.width = "100%";
      document.body.classList.add("modal-open");

      const preventScroll = (e: Event) => {
        // Only prevent scroll on the body, not inside modal content
        if (!(e.target as Element)?.closest(".modal-content")) {
          e.preventDefault();
          e.stopPropagation();
        }
        return false;
      };

      const preventScrollTouch = (e: TouchEvent) => {
        // Only prevent touch on body, not inside modal content
        if (
          e.touches.length > 1 ||
          !(e.target as Element)?.closest(".modal-content")
        ) {
          if (!(e.target as Element)?.closest(".modal-content")) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
        return false;
      };

      const preventKeydown = (e: KeyboardEvent) => {
        // Only prevent navigation keys, not input keys like spacebar in input fields
        if ([33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
          // Don't prevent if user is in an input field
          const activeElement = document.activeElement;
          if (
            activeElement?.tagName === "INPUT" ||
            activeElement?.tagName === "TEXTAREA"
          ) {
            return;
          }
          e.preventDefault();
        }
      };

      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventScrollTouch, {
        passive: false,
      });
      document.addEventListener("keydown", preventKeydown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.position = originalBodyPosition;
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.classList.remove("modal-open");
        window.scrollTo(0, originalScrollY);

        document.removeEventListener("wheel", preventScroll);
        document.removeEventListener("touchmove", preventScrollTouch);
        document.removeEventListener("keydown", preventKeydown);
      };
    }
  }, [isModalOpen]);

  const handleClose = () => {
    dispatch(closeAuthModal());
  };

  const handleLogin = () => {
    handleClose();
    router.push("/login");
  };
  const handleRegister = () => {
    handleClose();
    router.push("/register");
  };

  if (!isClient || !isModalOpen || isAuthenticated || !isVerified) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
      style={{ touchAction: "none" }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative modal-content"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10 cursor-pointer"
        >
          <X size={24} />
        </button>
        <div className="p-8">
          <motion.div
            className="text-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Image
              width={100}
              height={100}
              src={logo}
              alt="Iter Bene Logo"
              className="mx-auto mb-4"
            />
          </motion.div>
          <AnimatePresence mode="wait">
            {
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl md:text-3xl text-center font-bold text-gray-800 mb-3">
                  Welcome to Iter Bene!
                </h1>
                <p className="text-gray-600  text-center mb-6 text-sm md:text-base">
                  Please log in to access all features and enjoy your premium
                  travel experience.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={handleLogin}
                    className="w-full bg-secondary cursor-pointer text-white py-3 px-6 rounded-lg font-medium hover:bg-secondary/90 transition-all duration-300"
                  >
                    Login to Your Account
                  </button>
                  <button
                    onClick={handleRegister}
                    className="w-full text-secondary cursor-pointer border border-secondary py-3 px-6 rounded-lg font-medium hover:bg-secondary hover:text-white transition-all duration-300"
                  >
                    Create New Account
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full text-gray-600 cursor-pointer py-2 px-6 rounded-lg font-medium hover:text-gray-800 transition-colors duration-300"
                  >
                    Maybe Later
                  </button>
                </div>
              </motion.div>
            }
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-gray-500">
              Join thousands of travelers who trust Iter Bene for their journey
              planning
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
