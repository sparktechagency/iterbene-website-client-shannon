import Header from "@/components/common/header";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-full  flex flex-col ">
      <Header />
      <section className="w-full container mx-auto pt-[80px] md:pt-[100px] px-3 lg:pt-[125px] flex-1 overflow-hidden">
        {children}
      </section>
    </section>
  );
};

export default layout;
