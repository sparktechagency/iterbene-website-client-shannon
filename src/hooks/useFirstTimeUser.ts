"use client";
import { useEffect, useState } from "react";
import useUser from "./useUser";
import { usePathname } from "next/navigation";
import { useCookies, COOKIE_NAMES, migrateFromLocalStorage } from "@/contexts/CookieContext";

const useFirstTimeUser = () => {
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const userData = useUser();
  const pathname = usePathname();
  const { getBooleanCookie, setBooleanCookie, removeCookie } = useCookies();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      // Migrate from localStorage to cookies
      migrateFromLocalStorage();
    }
  }, []);

  useEffect(() => {
    if (!isClient || !userData) return;

    // Only show modal on feed (/) or home pages, not on auth pages
    const isFeedOrHomePage = pathname === "/" || pathname === "/feed";
    const isAuthPage =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/reset-password") ||
      pathname.startsWith("/verify-email");

    if (isAuthPage || !isFeedOrHomePage) return;

    // Check if user is a first-time user (set during registration)
    const isFirstTimeUser = getBooleanCookie(COOKIE_NAMES.IS_FIRST_TIME_USER);
    if (!isFirstTimeUser) return;

    // Check if user has already completed profile
    const hasCompletedProfile = getBooleanCookie(COOKIE_NAMES.PROFILE_COMPLETED);
    if (hasCompletedProfile) return;

    // Check if profile is incomplete - user must have all required fields
    const isProfileIncomplete =
      !userData.phoneNumber ||
      !userData.referredAs ||
      !userData.ageRange ||
      !userData.profession ||
      !userData.maritalStatus;

    // Show modal if profile is incomplete and user is first-time user
    if (isProfileIncomplete) {
      // Add a small delay before showing the modal to ensure smooth page load
      const timer = setTimeout(() => {
        setShowFirstTimeModal(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      // If profile is complete, mark as completed and remove first-time flag
      setBooleanCookie(COOKIE_NAMES.PROFILE_COMPLETED, true);
      removeCookie(COOKIE_NAMES.IS_FIRST_TIME_USER);
    }
  }, [isClient, userData, pathname, getBooleanCookie, setBooleanCookie, removeCookie]);

  const closeModal = () => {
    setShowFirstTimeModal(false);
    // If user closes modal without completing, remove first-time user flag to avoid showing again
    removeCookie(COOKIE_NAMES.IS_FIRST_TIME_USER);
  };

  return {
    showFirstTimeModal,
    closeModal,
    userData,
  };
};

export default useFirstTimeUser;
