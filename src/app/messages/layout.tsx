import Header from "@/components/common/header";
import Chats from "@/components/pages/message-inbox/chats/chats";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <section className="w-full container bg-[#F5F5F5] py-12">
        <div className="w-full p-6 flex flex-col md:flex-row gap-10 bg-white rounded-xl">
          <div className="w-full md:w-[25%]">
            <Chats />
          </div>
          <div className="w-full md:w-[75%] mx-auto">{children}</div>
        </div>
      </section>
    </>
  );
};

export default layout;
