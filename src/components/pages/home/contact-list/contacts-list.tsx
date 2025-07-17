"use client";
import { useGetChatsQuery } from "@/redux/features/inbox/inboxApi";
import ContactListCard from "./contact-list-card";
import { useEffect, useState } from "react";
import { IChat } from "@/types/chatTypes";
import ContactListCardSkeleton from "./ContactListCardSkeleton";
import useUser from "@/hooks/useUser";
const ContactList: React.FC = () => {
  const user = useUser();
  const { data: responseData, isLoading } = useGetChatsQuery(
    [
      {
        key: "page",
        value: 1,
      },
      {
        key: "limit",
        value: 6,
      },
    ],
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      skip: !user,
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

  let content = null;
  if (isLoading) {
    content = (
      <section className="w-full flex flex-col gap-2 mt-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ContactListCardSkeleton key={index} />
        ))}
      </section>
    );
  } else if (contacts?.length > 0) {
    content = (
      <section className="w-full flex flex-col gap-2 mt-4">
        {contacts?.map((contact) => (
          <ContactListCard key={contact._id} contact={contact} />
        ))}
      </section>
    );
  }

  return (
    <section className={`w-full hidden  md:block`}>
      {contacts?.length > 0 && (
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold uppercase">Contacts</h1>
          <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
            <span>{totalResults || 0}</span>
          </div>
        </div>
      )}
      {content}
    </section>
  );
};

export default ContactList;
