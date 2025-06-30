"use client";
import Header from "@/components/common/header";
import AuthorBio from "@/components/pages/home/author-bio/author-bio";
import Invitations from "@/components/pages/home/invitations/invitations";
import MainNavigation from "@/components/pages/home/main-navigation/main-navigation";
import UpcomingEvent from "@/components/pages/home/upcoming-event/upcoming-event";
import useUser from "@/hooks/useUser";
import React from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  return (
    <section className="w-full min-h-screen pt-[90px] md:pt-[130px]">
      <Header />
      <section className="w-full container mx-auto  grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="w-[382px] ml-[180px] hidden md:block  mx-auto col-span-full md:col-span-3 fixed left-0 top-0 space-y-5 md:space-y-5 pl-5">
          <AuthorBio />
          <MainNavigation />
          {user ? <Invitations /> : <UpcomingEvent />}
        </div>
        <div className="w-full md:col-span-9 px-4 ml-0 md:ml-[382px] min-h-screen">{children}</div>
      </section>
    </section>
  );
};

export default MainLayout;
