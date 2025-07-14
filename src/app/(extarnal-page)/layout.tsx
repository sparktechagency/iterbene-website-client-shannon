import Header from "@/components/common/header";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-full min-h-screen flex flex-col bg-amber-200">
      <Header />
      <div className="mt-28">{children}</div>
    </section>
  );
};

export default layout;
