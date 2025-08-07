"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Menu, X, Bell, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Hooks
import useUser from "@/hooks/useUser";
import { useHeaderSearch } from "@/hooks/useHeaderSearch";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";
import { useClickOutside } from "@/hooks/useClickOutside";

// Components
import CustomButton from "../custom/custom-button";
import MessagesDropdown from "./MessagesDropdown";
import NotificationsDropdown from "./NotificationsDropdown";
import UserDropdown from "./UserDropdown";
import SearchDropdown from "./SearchDropdown";
import LocationPermission from "./LocationPermission";

// Assets
import logo from "@/asset/logo/logo2.png";

// Mobile Menu Component (extracted and memoized)
const MobileMenu = React.memo<{
  user?: Record<string, unknown>;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}>(({ user, isOpen, onClose, onLogout }) => {
  const handleLogout = useCallback(() => {
    onLogout();
    onClose();
  }, [onLogout, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-screen overflow-y-auto w-full max-w-sm bg-white z-50 shadow-lg"
    >
      <div className="p-5">
        <div className="w-full flex justify-between items-center">
          <Image src={logo} alt="logo" width={100} height={100} />
          <button onClick={onClose} className="p-2">
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-5 space-y-3">
          {/* Navigation items would go here */}
          <Link
            href={`/${user?.username}`}
            onClick={onClose}
            className="block w-full text-left text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl"
          >
            My Profile
          </Link>
          
          <Link
            href="/feed"
            onClick={onClose}
            className="block w-full text-left text-gray-800 hover:bg-[#ECFCFA] px-4 py-3 rounded-xl"
          >
            Feed
          </Link>
          
          <button
            onClick={handleLogout}
            className="block w-full text-left text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl"
          >
            Logout
          </button>
        </nav>
      </div>
    </motion.div>
  );
});

MobileMenu.displayName = 'MobileMenu';

// Main Header Component
const OptimizedHeader: React.FC = () => {
  const user = useUser();
  const { logout } = useAuth();
  
  // Custom hooks for complex logic
  const {
    searchQuery,
    showSearchDropdown,
    searchResults,
    searchLoading,
    handleSearchChange,
    handleSearchFocus,
    handleSearchBlur,
    clearSearch,
    setShowSearchDropdown
  } = useHeaderSearch();
  
  const {
    messageCount,
    notificationCount,
    resetMessageCount,
    resetNotificationCount,
  } = useNotifications(user?._id);

  // Local state (minimized)
  const [dropdownStates, setDropdownStates] = useState({
    messages: false,
    notifications: false,
    user: false,
    mobileMenu: false,
    mobileSearch: false,
  });

  // Refs
  const messagesRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  // Click outside handlers
  useClickOutside([messagesRef], () => 
    setDropdownStates(prev => ({ ...prev, messages: false }))
  );
  
  useClickOutside([notificationsRef], () => 
    setDropdownStates(prev => ({ ...prev, notifications: false }))
  );
  
  useClickOutside([userRef], () => 
    setDropdownStates(prev => ({ ...prev, user: false }))
  );
  
  useClickOutside([searchRef, desktopSearchRef], () => 
    setShowSearchDropdown(false)
  );

  // Toggle handlers (memoized)
  const toggleDropdown = useCallback((dropdown: keyof typeof dropdownStates) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown],
      // Close other dropdowns when opening one
      ...(dropdown !== 'mobileMenu' && dropdown !== 'mobileSearch' ? {
        messages: dropdown === 'messages' ? !prev.messages : false,
        notifications: dropdown === 'notifications' ? !prev.notifications : false,
        user: dropdown === 'user' ? !prev.user : false,
      } : {})
    }));
  }, []);

  // Memoized dropdown handlers
  const dropdownHandlers = useMemo(() => ({
    toggleMessages: () => {
      toggleDropdown('messages');
      if (!dropdownStates.messages) resetMessageCount();
    },
    toggleNotifications: () => {
      toggleDropdown('notifications');
      if (!dropdownStates.notifications) resetNotificationCount();
    },
    toggleUser: () => toggleDropdown('user'),
    toggleMobileMenu: () => toggleDropdown('mobileMenu'),
    toggleMobileSearch: () => toggleDropdown('mobileSearch'),
  }), [toggleDropdown, dropdownStates.messages, dropdownStates.notifications, resetMessageCount, resetNotificationCount]);

  // Desktop Search Component (memoized)
  const DesktopSearch = useMemo(() => (
    <div ref={desktopSearchRef} className="relative hidden md:block">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search users or hashtags..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {showSearchDropdown && (
        <SearchDropdown
          searchResults={searchResults}
          searchLoading={searchLoading}
          onClose={() => setShowSearchDropdown(false)}
        />
      )}
    </div>
  ), [searchQuery, showSearchDropdown, searchResults, searchLoading, handleSearchChange, handleSearchFocus, handleSearchBlur, clearSearch, setShowSearchDropdown]);

  // If no user, show simple header
  if (!user) {
    return (
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex-shrink-0">
              <Image src={logo} alt="Iter Bene" width={120} height={40} />
            </Link>
            
            <div className="flex items-center gap-4">
              <CustomButton href="/login" variant="outline" size="sm">
                Login
              </CustomButton>
              <CustomButton href="/register" size="sm">
                Sign Up
              </CustomButton>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/feed" className="flex-shrink-0">
              <Image src={logo} alt="Iter Bene" width={120} height={40} />
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              {DesktopSearch}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Messages */}
              <div ref={messagesRef} className="relative">
                <button
                  onClick={dropdownHandlers.toggleMessages}
                  className="p-2 text-gray-600 hover:text-primary relative"
                >
                  <MessageCircle className="w-6 h-6" />
                  {messageCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {messageCount > 99 ? '99+' : messageCount}
                    </span>
                  )}
                </button>
                {dropdownStates.messages && (
                  <MessagesDropdown onClose={() => toggleDropdown('messages')} />
                )}
              </div>

              {/* Notifications */}
              <div ref={notificationsRef} className="relative">
                <button
                  onClick={dropdownHandlers.toggleNotifications}
                  className="p-2 text-gray-600 hover:text-primary relative"
                >
                  <Bell className="w-6 h-6" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </button>
                {dropdownStates.notifications && (
                  <NotificationsDropdown onClose={() => toggleDropdown('notifications')} />
                )}
              </div>

              {/* User Menu */}
              <div ref={userRef} className="relative">
                <button
                  onClick={dropdownHandlers.toggleUser}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100"
                >
                  <Image
                    src={user.profileImage}
                    alt={user.fullName}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </button>
                {dropdownStates.user && (
                  <UserDropdown 
                    user={user} 
                    onClose={() => toggleDropdown('user')}
                    onLogout={logout}
                  />
                )}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Search Toggle */}
              <button
                onClick={dropdownHandlers.toggleMobileSearch}
                className="p-2 text-gray-600 hover:text-primary"
              >
                <Search className="w-6 h-6" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={dropdownHandlers.toggleMobileMenu}
                className="p-2 text-gray-600 hover:text-primary"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {dropdownStates.mobileSearch && (
            <div ref={searchRef} className="md:hidden pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users or hashtags..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={() => {
                    clearSearch();
                    toggleDropdown('mobileSearch');
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {showSearchDropdown && (
                <SearchDropdown
                  searchResults={searchResults}
                  searchLoading={searchLoading}
                  onClose={() => setShowSearchDropdown(false)}
                />
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        user={user}
        isOpen={dropdownStates.mobileMenu}
        onClose={() => toggleDropdown('mobileMenu')}
        onLogout={logout}
      />

      {/* Location Permission (only show once) */}
      <LocationPermission />
    </>
  );
};

export default OptimizedHeader;