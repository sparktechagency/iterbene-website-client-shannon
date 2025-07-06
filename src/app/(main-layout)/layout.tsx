"use client";
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

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const pathname = usePathname();
  
  // Check if current path should hide Section 3
  const shouldHideSection3 = React.useMemo(() => {
    const hiddenPaths = ['/connections', '/groups', '/events'];
    
    return hiddenPaths.some(path => {
      if (path === pathname) return true;
      // Check for dynamic routes like /groups/id or /events/id
      if (pathname.startsWith(path + '/')) return true;
      return false;
    });
  }, [pathname]);
  
  return (
    <section className="w-full h-full">
      <Header />
      {/* Mobile & Tablet Layout - Only show main content */}
      <section className="w-full container mx-auto px-3 sm:px-5 pt-[90px] md:pt-[130px] block lg:hidden">
        <div className="w-full pb-10">
          {children}
        </div>
      </section>

      {/* Desktop Layout */}
      <section className="w-full container mx-auto px-5 hidden lg:flex gap-5 pt-[130px]">
        {/* Section 1 - Fixed/Static with max width */}
        <div className="w-full hidden xl:block max-w-[260px] md:max-w-[280px] xl:max-w-[320px] 2xl:max-w-[382px] space-y-5 pb-10 sticky top-[130px] h-fit max-h-[calc(100vh-130px)] overflow-y-auto scrollbar-hide">
          <AuthorBio />
          <MainNavigation />
          {user ? <Invitations /> : <UpcomingEvent />}
        </div>
        
        {/* Section 2 - Scrollable content */}
        <div className="flex-1 pb-10 overflow-y-auto min-w-0">
          {children}
        </div>
        
        {/* Section 3 - Fixed/Static with max width - Conditionally hidden */}
        {!shouldHideSection3 && (
          <div className="w-full max-w-[260px] md:max-w-[280px] xl:max-w-[320px] 2xl:max-w-[382px] sticky top-[130px] h-fit scrollbar-hide">
            <FriendRequest />
            <ContactList />
          </div>
        )}
      </section>
    </section>
  );
};

export default MainLayout;