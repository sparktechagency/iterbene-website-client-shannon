"use client";
// Import necessary components and hooks
import Header from "@/components/common/header";
import AuthorBio from "@/components/pages/home/author-bio/author-bio";
import ContactList from "@/components/pages/home/contact-list/contacts-list";
import FriendRequest from "@/components/pages/home/friend-request/friend-request";
import Invitations from "@/components/pages/home/invitations/invitations";
import MainNavigation from "@/components/pages/home/main-navigation/main-navigation";
import UpcomingEvent from "@/components/pages/home/upcoming-event/upcoming-event";
import useUser from "@/hooks/useUser";
import { usePathname } from "next/navigation";
import React from "react";
import FirstTimeUserModal from "@/components/common/FirstTimeUserModal";
import useFirstTimeUser from "@/hooks/useFirstTimeUser";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  // Custom hook to get user data
  const user = useUser();
  // Hook to get the current URL path
  const pathname = usePathname();
  // Hook to manage first-time user modal
  const { showFirstTimeModal, closeModal } = useFirstTimeUser();

  // Memoized function to determine if the third section should be hidden based on the current path.
  // This is used to create more space for content on specific pages.
  const shouldHideSection3 = React.useMemo(() => {
    // Paths where the third section (friend requests, contact list) should be hidden
    const hiddenPaths = [
      "/connections",
      "/groups",
      "/events",
      "/journeys",
      "/search/posts-locations",
    ];

    // Check if the current path matches any of the hidden paths or is a sub-path of them
    return hiddenPaths.some((path) => {
      if (path === pathname) return true;
      // Check for dynamic routes like /groups/id or /events/id
      if (pathname.startsWith(path + "/")) return true;
      return false;
    });
  }, [pathname]);

  return (
    <section className="w-full h-full">
      {/* Header component is always visible */}
      <Header />

      {/* Layout for Mobile & Tablet screens (hidden on large screens) */}
      <section className="w-full container mx-auto px-3 sm:px-5 pt-[90px] md:pt-[130px] block lg:hidden">
        <div className="w-full pb-10">
          {/* Main content is rendered here */}
          {children}
        </div>
      </section>

      {/* Layout for Desktop screens (visible on large screens) */}
      <section className="w-full container mx-auto px-5 hidden lg:flex gap-5 pt-[130px]">
        {/* Section 1: Left Sidebar (Static) */}
        <div className="w-full hidden xl:block max-w-[260px] md:max-w-[280px] xl:max-w-[320px] 2xl:max-w-[382px] space-y-5 pb-10 sticky top-[130px] h-fit max-h-[calc(100vh-130px)] overflow-y-auto scrollbar-hide">
          <AuthorBio />
          <MainNavigation />
          {/* Show invitations if user is logged in, otherwise show upcoming events */}
          {user ? <Invitations /> : <UpcomingEvent />}
        </div>

        {/* Section 2: Main Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto min-w-0 min-h-[calc(100vh-130px)]">
          {children}
        </div>

        {/* Section 3: Right Sidebar (Static & Conditionally Hidden) */}
        {!shouldHideSection3 && (
          <div className="w-full max-w-[260px] md:max-w-[280px] xl:max-w-[320px] 2xl:max-w-[382px] space-y-5 pb-10 sticky top-[130px] h-fit max-h-[calc(100vh-130px)] overflow-y-auto scrollbar-hide">
            <FriendRequest />
            <ContactList />
          </div>
        )}
      </section>

      {/* First Time User Modal */}
      <FirstTimeUserModal isOpen={showFirstTimeModal} onClose={closeModal} />
    </section>
  );
};

export default MainLayout;
