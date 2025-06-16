"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { IChat } from "@/types/chatTypes";
import { useGetChatsQuery } from "@/redux/features/inbox/inboxApi";
import ChatListCardSkeleton from "./ChatListCardSkeleton";
import ChatCard from "./chat-card";
import { debounce } from "lodash";

const Chats = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [chats, setChats] = useState<IChat[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const limit = 9;

  const { data: responseData, isLoading: chatLoading } = useGetChatsQuery(
    {
      page: currentPage,
      limit,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const totalResults = responseData?.data?.attributes?.totalResults;
  const totalPages = Math.ceil((totalResults || 0) / limit);

  /** 📌 Sort chats whenever new data is received */
  useEffect(() => {
    if (responseData?.data?.attributes?.results) {
      const newChats = responseData.data.attributes.results;
      setChats((prev) => {
        const existingIds = new Set(prev.map((chat) => chat._id));
        const uniqueNewChats = newChats.filter(
          (chat: IChat) => !existingIds.has(chat._id)
        );
        if (uniqueNewChats.length === 0) return prev;
        const updatedChats = [...prev, ...uniqueNewChats].sort(
          (a, b) =>
            new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
        );
        return updatedChats;
      });
      setHasMore(currentPage < totalPages);
      setIsLoadingMore(false);
    }
  }, [responseData, currentPage, totalPages]);

  /** 📌 Load more chats when scrolling near the bottom */
  const loadMoreChats = useCallback(() => {
    if (
      !isLoadingMore &&
      hasMore &&
      scrollRef.current &&
      scrollRef.current.scrollTop + scrollRef.current.clientHeight >=
        scrollRef.current.scrollHeight - 100
    ) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  }, [isLoadingMore, hasMore]);

  /** 📌 Debounced scroll handler */
  const debouncedHandleScroll = useMemo(
    () =>
      debounce(() => {
        if (scrollRef.current) {
          loadMoreChats();
        }
      }, 100),
    [loadMoreChats]
  );

  /** 📌 Attach scroll event listener */
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", debouncedHandleScroll);
      return () => {
        scrollElement.removeEventListener("scroll", debouncedHandleScroll);
        debouncedHandleScroll.cancel();
      };
    }
  }, [debouncedHandleScroll]);

  /** 📌 Render content */
  let content = null;

  if (chatLoading && chats?.length <= 0) {
    content = (
      <div ref={scrollRef} className="w-full flex flex-col gap-3 overflow-y-auto">
        {[...Array(7)].map((_, index) => (
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
      <div
        ref={scrollRef}
        className="w-full flex flex-col gap-2 overflow-y-auto"
        style={{ maxHeight: "calc(85vh - 130px)" }} // Adjust height as needed
      >
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          </div>
        )}
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

      {/* Chat List (Dynamically Sorted with Infinite Scroll) */}
      {content}
    </section>
  );
};

export default Chats;