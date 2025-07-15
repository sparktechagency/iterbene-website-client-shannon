"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import useUser from "@/hooks/useUser";
import {
  closeAuthModal,
  openAuthModal,
} from "@/redux/features/auth/authModalSlice";
import Image from "next/image";
import { X } from "lucide-react";
import logo from "@/asset/logo/logo.png";
import { useRouter } from "next/navigation";

type ModalStep =
  | "welcome"
  | "login"
  | "register"
  | "forgot"
  | "verify"
  | "reset";

const AuthModal = () => {
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(
    (state: RootState) => state.auth.showAuthModal
  );
  const currentStep = useAppSelector(
    (state: RootState) => state.auth.currentStep
  );
  const isAuthenticated = useUser();
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [modalStep, setModalStep] = useState<ModalStep>("welcome");
  const router = useRouter();

  // Check if client-side and UserVerification status
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const userVerified = localStorage.getItem("iterBeneVerified");
      setIsVerified(userVerified === "true");
    }
  }, []);

  // Sync local modalStep with Redux currentStep
  useEffect(() => {
    setModalStep(currentStep);
  }, [currentStep]);

  // Timer for showing modal after 30 seconds if not authenticated and verified
  useEffect(() => {
    if (!isAuthenticated && isVerified) {
      const timer = setTimeout(() => {
        dispatch(openAuthModal("welcome"));
      }, 30000); // 30 seconds
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isVerified, dispatch]);

  // Handle body overflow and prevent scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.classList.add("modal-open");

      const preventScroll = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };

      const preventScrollTouch = (e: TouchEvent) => {
        if (e.touches.length > 1) return;
        e.preventDefault();
        e.stopPropagation();
        return false;
      };

      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventScrollTouch, {
        passive: false,
      });
      document.addEventListener("scroll", preventScroll, { passive: false });
      document.addEventListener("keydown", (e) => {
        if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
          e.preventDefault();
        }
      });

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.classList.remove("modal-open");
        document.removeEventListener("wheel", preventScroll);
        document.removeEventListener("touchmove", preventScrollTouch);
        document.removeEventListener("scroll", preventScroll);
        document.removeEventListener("keydown", (e) => {
          if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
            e.preventDefault();
          }
        });
      };
    }
  }, [isModalOpen]);

  const handleClose = () => {
    dispatch(closeAuthModal());
    setModalStep("welcome");
  };

  const renderWelcomeStep = () => (
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
        Please log in to access all features and enjoy your premium travel
        experience.
      </p>
      <div className="space-y-4">
        <button
          onClick={() => router.push("/login")}
          className="w-full bg-secondary cursor-pointer text-white py-3 px-6 rounded-lg font-medium hover:bg-secondary/90 transition-all duration-300"
        >
          Login to Your Account
        </button>
        <button
          onClick={() => router.push("/register")}
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
  );

  const renderCurrentStep = () => {
    switch (modalStep) {
      case "welcome":
        return renderWelcomeStep();
      default:
        return renderWelcomeStep();
    }
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative"
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
          <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
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
