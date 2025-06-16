import Header from "@/components/common/header";
import Chats from "@/components/pages/message-inbox/chats/chats";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-full">
      <Header />
      <section className="w-full container pt-[125px]">
        <div className="w-full p-6 flex flex-col md:flex-row gap-6 bg-white rounded-xl">
          <div className="w-full md:w-[25%]">
            <Chats />
          </div>
          <div className="w-full md:w-[75%] mx-auto">{children}</div>
        </div>
      </section>
    </section>
  );
};

export default layout;
