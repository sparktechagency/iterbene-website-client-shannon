import WatchVideo from "@/components/pages/watch-video/watch-video";
import React from "react";

export const metadata = {
  title: "Watch Videos - Iter Bene",
  description:
    "Discover and connect with travelers, share your adventures, and explore new destinations on Iter Bene.",
};
const page = () => {
  return (
    <section className="w-full space-y-5 md:space-y-8 overflow-y-auto">
      <WatchVideo />
    </section>
  );
};

export default page;
