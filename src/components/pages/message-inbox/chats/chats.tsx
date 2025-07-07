"use client";
import { useGetChatsQuery } from "@/redux/features/inbox/inboxApi";
import ChatListCardSkeleton from "./ChatListCardSkeleton";
import ChatCard from "./chat-card";
import { IChat } from "@/types/chatTypes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const Chats = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // UseRef
  const observerRef = useRef<IntersectionObserver | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const { data: responseData, isLoading: chatLoading } = useGetChatsQuery(
    [
      {
        key: "page",
        value: page,
      },
      {
        key: "limit",
        value: 15,
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

  // Sort chats by updatedAt in descending order (newest first)
  const sortedChats = useMemo(() => {
    return chats
      ? [...chats].sort((a: IChat, b: IChat) => {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        })
      : [];
  }, [chats]);

  useEffect(() => {
    if (chats?.length > 0) {
      const totalLoaded = page * 15;
      setHasMore(totalLoaded < totalResults);
    }
  }, [chats, page, totalResults]);

  // Scroll to top when new message moves a chat to top
  const scrollToTop = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);
  // Monitor for chat order changes (when someone sends a new message)
  const prevSortedChatsRef = useRef<IChat[]>([]);
  useEffect(() => {
    if (sortedChats.length > 0 && prevSortedChatsRef.current.length > 0) {
      const currentTopChatId = sortedChats[0]?._id;
      const prevTopChatId = prevSortedChatsRef.current[0]?._id;

      // If the top chat has changed, scroll to top
      if (currentTopChatId !== prevTopChatId) {
        scrollToTop();
      }
    }
    prevSortedChatsRef.current = sortedChats;
  }, [sortedChats, scrollToTop]);

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
  if (chatLoading && page === 1 && sortedChats?.length === 0) {
    content = (
      <div className="w-full flex flex-col gap-6 overflow-y-auto p-4">
        {[...Array(8)].map((_, index) => (
          <ChatListCardSkeleton key={index} />
        ))}
      </div>
    );
  } else if (!chatLoading && sortedChats?.length === 0 && page === 1) {
    content = (
      <div className="w-full h-full flex items-center justify-center">
        <h1 className="text-2xl font-semibold">No Chats Found</h1>
      </div>
    );
  } else if (sortedChats?.length > 0) {
    content = (
      <div
        ref={chatContainerRef}
        className="w-full h-full flex flex-col gap-2 overflow-y-auto p-3 md:p-4"
      >
        {sortedChats.map((chat: IChat, index: number) => {
          if (sortedChats?.length === index + 1) {
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
          <div className="w-full flex flex-col gap-2 p-4">
            {[...Array(3)].map((_, index) => (
              <ChatListCardSkeleton key={`loading-${index}`} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="w-full h-full flex flex-col space-y-2">
      <div className="p-3">
        <input
          type="text"
          name="search"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full py-3 px-4 border border-[#CCC0DB] rounded-2xl outline-none"
          placeholder="Search"
        />
      </div>
      <div className="flex-1 overflow-y-auto ">{content}</div>
    </section>
  );
};

export default Chats;
