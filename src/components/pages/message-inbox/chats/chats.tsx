"use client";
import { useState, useEffect } from "react";
import { IChat } from "@/types/chatTypes";
import { useGetChatsQuery } from "@/redux/features/inbox/inboxApi";
import ChatListCardSkeleton from "./ChatListCardSkeleton";
import ChatCard from "./chat-card";

const Chats = () => {
  const { data: responseData, isLoading: chatLoading } = useGetChatsQuery({
    page: 1,
    limit: 12,
  });
  const totalResults = responseData?.data?.attributes?.totalResults;
  const [chats, setChats] = useState<IChat[]>([]);

  /** 📌 Sort chats whenever new data is received */
  useEffect(() => {
    if (responseData?.data?.attributes?.results) {
      console.log("Chats:", responseData?.data?.attributes?.results);
      // **Sort chats by `updatedAt` (newest first)**
      const sortedChats = [...responseData.data.attributes.results].sort(
        (a, b) =>
          new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
      );
      setChats(sortedChats);
    }
  }, [responseData]);

  /** 📌 Render content */
  let content = null;

  if (chatLoading && chats.length <= 0) {
    content = (
      <div className="w-full flex flex-col gap-6 overflow-y-auto">
        {[...Array(6)].map((_, index) => (
          <ChatListCardSkeleton key={index} />
        ))}
      </div>
    );
  } else if (!chatLoading && totalResults === 0) {
    content = (
      <div className="w-full flex items-center justify-center">
        <h1 className="text-2xl font-semibold">No Chats Found</h1>
      </div>
    );
  } else if (!chatLoading && totalResults > 0) {
    content = (
      <div className={`w-full  flex flex-col gap-2  overflow-y-auto`}>
        {chats.map((chat: IChat) => (
          <ChatCard key={chat._id} chat={chat} />
        ))}
      </div>
    );
  }

  return (
    <section>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          name="search"
          className="w-full py-3 px-4 border border-[#CCC0DB] rounded-2xl outline-none"
          placeholder="Search"
        />
      </div>

      {/* Chat List (Dynamically Sorted) */}
      {content}
    </section>
  );
};

export default Chats;
