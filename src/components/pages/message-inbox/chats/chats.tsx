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
      const totalLoaded = page * 8;
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
      <div className="w-full flex flex-col gap-6 overflow-y-auto">
        {[...Array(6)].map((_, index) => (
          <ChatListCardSkeleton key={index} />
        ))}
      </div>
    );
  } else if (!chatLoading && sortedChats?.length === 0 && page === 1) {
    content = (
      <div className="w-full flex items-center justify-center">
        <h1 className="text-2xl font-semibold">No Chats Found</h1>
      </div>
    );
  } else if (sortedChats?.length > 0) {
    content = (
      <div
        ref={chatContainerRef}
        className="w-full flex flex-col h-[calc(85vh-130px)] gap-2 overflow-y-auto"
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

// "use client";
// import { useGetChatsQuery } from "@/redux/features/inbox/inboxApi";
// import ChatListCardSkeleton from "./ChatListCardSkeleton";
// import ChatCard from "./chat-card";
// import { IChat } from "@/types/chatTypes";
// import { useCallback, useEffect, useRef, useState } from "react";

// const Chats = () => {
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [sortedChats, setSortedChats] = useState<IChat[]>([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const observerRef = useRef<IntersectionObserver | null>(null);
//   const chatContainerRef = useRef<HTMLDivElement | null>(null);

//   const { data: responseData, isLoading: chatLoading } = useGetChatsQuery(
//     [
//       {
//         key: "page",
//         value: page,
//       },
//       {
//         key: "limit",
//         value: 8, // Changed to 8 as per requirement
//       },
//       {
//         key: "userName",
//         value: searchQuery,
//       },
//     ],
//     {
//       refetchOnMountOrArgChange: true,
//     }
//   );

//   const chatData = responseData?.data?.attributes;
//   const totalResults = chatData?.totalResults || 0;
//   const chats = chatData?.results;

//   // Reset page when search query changes
//   useEffect(() => {
//     setPage(1);
//   }, [searchQuery]);

//   // Update all chats when new page data comes
//   useEffect(() => {
//     if (chats && chats.length > 0) {
//       if (page === 1) {
//         // For first page or search, replace all chats and sort them
//         const sorted = [...chats].sort((a: IChat, b: IChat) => {
//           return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
//         });
//         setSortedChats(sorted);
//         setIsSearching(false); // Stop search loading when data comes
//       } else {
//         // For subsequent pages, append new chats and sort
//         setSortedChats(prevChats => {
//           const existingIds = new Set(prevChats.map(chat => chat._id));
//           const newChats = chats.filter((chat: IChat) => !existingIds.has(chat._id));
//           const combined = [...prevChats, ...newChats];
//           return combined.sort((a: IChat, b: IChat) => {
//             return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
//           });
//         });
//       }

//       // Update hasMore based on total loaded vs total available
//       const totalLoaded = page * 8;
//       setHasMore(totalLoaded < totalResults);
//     } else if (page === 1) {
//       // If no chats for first page, clear all chats
//       setSortedChats([]);
//       setHasMore(false);
//       setIsSearching(false); // Stop search loading even if no data
//     }
//   }, [chats, page, totalResults]);

//   // Sort chats by updatedAt in descending order (newest first)
//   // Note: Sorting is now handled in the useEffect above

//   // Scroll to top when new message moves a chat to top
//   const scrollToTop = useCallback(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTo({
//         top: 0,
//         behavior: 'smooth'
//       });
//     }
//   }, []);

//   // Monitor for chat order changes (when someone sends a new message)
//   const prevSortedChatsRef = useRef<IChat[]>([]);
//   useEffect(() => {
//     if (sortedChats.length > 0 && prevSortedChatsRef.current.length > 0) {
//       const currentTopChatId = sortedChats[0]?._id;
//       const prevTopChatId = prevSortedChatsRef.current[0]?._id;

//       // If the top chat has changed, scroll to top
//       if (currentTopChatId !== prevTopChatId) {
//         scrollToTop();
//       }
//     }
//     prevSortedChatsRef.current = sortedChats;
//   }, [sortedChats, scrollToTop]);

//   const lastChatElementRef = useCallback(
//     (node: HTMLDivElement | null) => {
//       if (chatLoading) return;
//       if (observerRef.current) observerRef.current.disconnect();

//       observerRef.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore && !chatLoading) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       });

//       if (node) observerRef.current.observe(node);
//     },
//     [chatLoading, hasMore]
//   );

//   useEffect(() => {
//     return () => {
//       if (observerRef.current) observerRef.current.disconnect();
//     };
//   }, []);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const searchValue = e.target.value;
//     setSearchQuery(searchValue);
//     setSortedChats([]); // Clear existing chats when searching
//     setHasMore(true);

//     // Set searching to true when user types something
//     if (searchValue.trim() !== "") {
//       setIsSearching(true);
//     } else {
//       setIsSearching(false);
//     }

//     // Reset page to 1 after setting search query
//     setPage(1);
//   };

//   let content = null;

//   if ((chatLoading && page === 1 && sortedChats?.length === 0) || isSearching) {
//     content = (
//       <div className="w-full flex flex-col gap-6 overflow-y-auto">
//         {[...Array(6)].map((_, index) => (
//           <ChatListCardSkeleton key={index} />
//         ))}
//       </div>
//     );
//   } else if (!chatLoading && !isSearching && sortedChats?.length === 0 && page === 1) {
//     content = (
//       <div className="w-full flex items-center justify-center">
//         <h1 className="text-2xl font-semibold">No Chats Found</h1>
//       </div>
//     );
//   } else if (sortedChats?.length > 0) {
//     content = (
//       <div
//         ref={chatContainerRef}
//         className="w-full flex flex-col h-[calc(85vh-130px)] gap-2 overflow-y-auto"
//       >
//         {sortedChats.map((chat: IChat, index: number) => {
//           if (sortedChats?.length === index + 1) {
//             return (
//               <div key={chat._id} ref={lastChatElementRef}>
//                 <ChatCard chat={chat} />
//               </div>
//             );
//           } else {
//             return <ChatCard key={chat._id} chat={chat} />;
//           }
//         })}
//         {chatLoading && page > 1 && (
//           <div className="w-full flex flex-col gap-2">
//             {[...Array(3)].map((_, index) => (
//               <ChatListCardSkeleton key={`loading-${index}`} />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <section>
//       <div className="mb-6">
//         <input
//           type="text"
//           name="search"
//           value={searchQuery}
//           onChange={handleSearch}
//           className="w-full py-3 px-4 border border-[#CCC0DB] rounded-2xl outline-none"
//           placeholder="Search"
//         />
//       </div>
//       {content}
//     </section>
//   );
// };

// export default Chats;
