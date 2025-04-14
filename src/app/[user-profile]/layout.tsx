import Header from "@/components/common/header";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <Header />
      {children}
    </section>
  );
};

export default layout;
