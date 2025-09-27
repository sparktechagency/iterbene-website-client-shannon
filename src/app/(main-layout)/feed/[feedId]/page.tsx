import FeedDetails from "@/components/pages/home/feed-details/FeedDetails";
import React from "react";

const page = () => {
  return (
    <section className="w-full xl:col-span-8 space-y-5 md:space-y-8 overflow-y-auto">
      <FeedDetails />
    </section>
  );
};

export default page;
