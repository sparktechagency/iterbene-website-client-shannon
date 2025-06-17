"use client";
import { useGetChatsQuery } from "@/redux/features/inbox/inboxApi";
import ChatListCardSkeleton from "./ChatListCardSkeleton";
import ChatCard from "./chat-card";
import { IChat } from "@/types/chatTypes";
import { useCallback, useEffect, useRef, useState } from "react";

const Chats = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { data: responseData, isLoading: chatLoading } = useGetChatsQuery(
    [
      {
        key: "page",
        value: page,
      },
      {
        key: "limit",
        value: 100,
      },
      {
        key: "userName",
        value: searchQuery,
      },
    ],
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const chatData = responseData?.data?.attributes;
  const totalResults = chatData?.totalResults || 0;
  const chats = chatData?.results;

  useEffect(() => {
    if (chats?.length > 0) {
      const totalLoaded = page * 8;
      setHasMore(totalLoaded < totalResults);
    }
  }, [chats, page, totalResults]);

  const lastChatElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (chatLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !chatLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [chatLoading, hasMore]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  let content = null;

  if (chatLoading && page === 1 && chats?.length === 0) {
    content = (
      <div className="w-full flex flex-col gap-6 overflow-y-auto">
        {[...Array(6)].map((_, index) => (
          <ChatListCardSkeleton key={index} />
        ))}
      </div>
    );
  } else if (!chatLoading && chats?.length === 0 && page === 1) {
    content = (
      <div className="w-full flex items-center justify-center">
        <h1 className="text-2xl font-semibold">No Chats Found</h1>
      </div>
    );
  } else if (chats?.length > 0) {
    content = (
      <div className="w-full flex flex-col h-[calc(85vh-130px)] gap-2 overflow-y-auto">
        {chats.map((chat: IChat, index: number) => {
          if (chats?.length === index + 1) {
            return (
              <div key={chat._id} ref={lastChatElementRef}>
                <ChatCard chat={chat} />
              </div>
            );
          } else {
            return <ChatCard key={chat._id} chat={chat} />;
          }
        })}
        {chatLoading && page > 1 && (
          <div className="w-full flex flex-col gap-2">
            {[...Array(3)].map((_, index) => (
              <ChatListCardSkeleton key={`loading-${index}`} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <section>
      <div className="mb-6">
        <input
          type="text"
          name="search"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full py-3 px-4 border border-[#CCC0DB] rounded-2xl outline-none"
          placeholder="Search"
        />
      </div>
      {content}
    </section>
  );
};

export default Chats;
