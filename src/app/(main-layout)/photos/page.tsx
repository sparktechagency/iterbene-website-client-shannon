import ContactList from "@/components/pages/home/contact-list/contacts-list";
import FriendRequest from "@/components/pages/home/friend-request/friend-request";
import Photos from "@/components/pages/photos/photos";
import React from "react";

const page = () => {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-5 pr-5">
      <div className="w-full md:col-span-8 space-y-5 md:space-y-8 overflow-y-auto">
        <Photos />
      </div>
      <div className="w-full max-w-[382px] mx-auto col-span-full md:col-span-4 space-y-5 md:space-y-8">
        <FriendRequest />
        <ContactList />
      </div>
    </section>
  );
};

export default page;
