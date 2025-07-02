import ContactList from "@/components/pages/home/contact-list/contacts-list";
import FeedDetails from "@/components/pages/home/feed-details/FeedDetails";
import FriendRequest from "@/components/pages/home/friend-request/friend-request";
import React from "react";

const page = () => {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-5">
      <div className="w-full col-span-full xl:col-span-8 space-y-5 md:space-y-8 overflow-y-auto">
        <FeedDetails />
      </div>
      <div className="w-[382px] mr-[203px] hidden md:block  mx-auto col-span-full md:col-span-3 fixed right-0 top-[130px] space-y-5 md:space-y-8 pl-5">
        <FriendRequest />
        <ContactList />
      </div>
    </section>
  );
};

export default page;
