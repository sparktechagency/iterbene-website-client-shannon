"use client";
import { useGetChatsQuery } from "@/redux/features/inbox/inboxApi";
import ContactListCard from "./contact-list-card";
import { useEffect, useState } from "react";
import { IChat } from "@/types/chatTypes";
const ContactList: React.FC = () => {
  const { data: responseData } = useGetChatsQuery(
    {
      page: 1,
      limit: 10,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const totalResults = responseData?.data?.attributes?.totalResults;
  const [contacts, setContacts] = useState<IChat[]>([]);

  /** 📌 Sort chats whenever new data is received */
  useEffect(() => {
    if (responseData?.data?.attributes?.results) {
      // **Sort chats by `updatedAt` (newest first)**
      const sortedContacts = [...responseData.data.attributes.results].sort(
        (a, b) =>
          new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
      );
      setContacts(sortedContacts);
    }
  }, [responseData]);

  return (
    <section className="w-full hidden md:block">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold uppercase">Contacts</h1>
        <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
          <span>{totalResults}</span>
        </div>
      </div>
      <div className="w-full space-y-4 mt-4">
        {contacts?.map((contact) => (
          <ContactListCard key={contact._id} contact={contact} />
        ))}
      </div>
    </section>
  );
};

export default ContactList;
