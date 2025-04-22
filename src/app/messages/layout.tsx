import Header from "@/components/common/header";
import Chats from "@/components/pages/message-inbox/chats/chats";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <section className="w-full container bg-[#F5F5F5]">
      <div className="w-full h-screen py-12  flex">
      <div className="w-full md:w-[30%]  px-5"><Chats/></div>
      <div className="w-full md:w-[70%] mx-auto">{children}</div>
      </div>
      </section>
    </>
  );
};

export default layout;
