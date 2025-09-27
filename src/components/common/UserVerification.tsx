/* eslint-disable react/no-unescaped-entities */
"use client";
import logo from "@/asset/logo/logo2.png";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getBooleanCookie, setBooleanCookie, COOKIE_NAMES } from "@/utils/cookies";
import Link from "next/link";

const UserVerification = () => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");
  // Using direct imports

  // Get verification status reactively from cookies
  const userVerified = getBooleanCookie(COOKIE_NAMES.ITER_BENE_VERIFIED);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  // Watch for verification status changes
  useEffect(() => {
    if (isClient) {
      setIsVisible(!userVerified);
    }
  }, [isClient, userVerified]);

  // Separate useEffect to handle body overflow - Simple and Clean approach
  useEffect(() => {
    if (isVisible) {
      // Store original overflow values
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      // Simple overflow hidden approach
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Add CSS class for additional control
      document.body.classList.add("modal-open");

      // Prevent scroll events
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

      // Add event listeners
      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventScrollTouch, {
        passive: false,
      });
      document.addEventListener("scroll", preventScroll, { passive: false });
      document.addEventListener("keydown", (e) => {
        // Prevent arrow keys, page up/down, space, home, end from scrolling
        if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
          e.preventDefault();
        }
      });

      // Cleanup function
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.classList.remove("modal-open");

        // Remove all event listeners
        document.removeEventListener("wheel", preventScroll);
        document.removeEventListener("touchmove", preventScrollTouch);
        document.removeEventListener("scroll", preventScroll);
      };
    }
  }, [isVisible]);

  const handleLocationVerify = () => {
    setErrorMessage("");
    setStep(2);
  };

  const handleAgeVerify = () => {
    setErrorMessage("");
    setBooleanCookie(COOKIE_NAMES.ITER_BENE_VERIFIED, true);
    setIsVisible(false);
  };

  const handleLocationReject = () => {
    setErrorMessage(
      "Sorry, Iter Bene is currently only available for travelers in the United States. Access is restricted."
    );
  };

  const handleAgeReject = () => {
    setErrorMessage(
      "You must be 13 or older to access Iter Bene travel services. Access is restricted."
    );
  };

  if (!isClient || !isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
      style={{ touchAction: "none" }}
    >
      <motion.div
        className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center mx-4"
        initial={{ scale: 0.7, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.7, opacity: 0, y: 50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Image
            width={180}
            height={180}
            src={logo}
            alt="Iter Bene Logo"
            className="mb-6 mx-auto"
          />
        </motion.div>

        <motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to Iter Bene
          </h1>
          <p className="text-gray-600 mb-6 text-sm">
            Your premium travel companion
          </p>
        </motion.div>

        {step === 1 && (
          <motion.div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Are you currently located in the United States?
            </h2>
            <motion.button
              onClick={handleLocationVerify}
              className="w-full bg-secondary text-white py-3 rounded-lg mb-4 transition-all duration-300 cursor-pointer"
            >
              Yes, I'm in the USA
            </motion.button>
            <motion.button
              onClick={handleLocationReject}
              className="w-full text-gray-600 border border-gray-300 py-3 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-all duration-300 cursor-pointer"
            >
              No, I'm elsewhere
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Are you 13 years or older?
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Age verification is required to access our travel services
            </p>
            <motion.button
              onClick={handleAgeVerify}
              className="w-full bg-secondary text-white py-3 rounded-lg mb-4 transition-all duration-300 cursor-pointer"
            >
              Yes, I'm 13 or older
            </motion.button>
            <motion.button
              onClick={handleAgeReject}
              className="w-full text-gray-600 border border-gray-300 py-3 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-all duration-300 cursor-pointer"
            >
              No, I'm under 13
            </motion.button>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div className="bg-red-500 text-white p-4 rounded-lg mt-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm"
            >
              {errorMessage}
            </motion.p>
          </motion.div>
        )}

        <motion.div className="mt-6">
          <p className="text-xs text-gray-500 flex flex-wrap gap-1 justify-center">
            By continuing, you agree to our {" "}
            <Link
              href="/terms-and-conditions"
              className="text-secondary hover:underline"
            >
              terms of service
            </Link> {" "}
            and {" "}
            <Link
              href="/privacy-policy"
              className="text-secondary hover:underline"
            >
              privacy policy
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default UserVerification;
