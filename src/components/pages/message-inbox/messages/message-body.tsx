"use client";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useGetMessagesQuery } from "@/redux/features/inbox/inboxApi";
import { useParams } from "next/navigation";
import useUser from "@/hooks/useUser";
import { IMessage } from "@/types/messagesType";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useGetSingleByUserIdQuery } from "@/redux/features/users/userApi";
import { debounce } from "lodash";

// Import components
import DateSeparator from "./DateSeparator";
import MessageLoadingSkeleton from "./MessageLoadingSkeleton";
import { getDateGroupLabel, groupMessagesByDate } from "@/utils/dateGroup";
import MessageItem from "./MessageItem";

const MessageBody = () => {
  const { receiverId } = useParams();
  const user = useUser();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [allLoadedMessages, setAllLoadedMessages] = useState<IMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const limit = 10;

  const { data: result } = useGetSingleByUserIdQuery(receiverId, {
    refetchOnMountOrArgChange: true,
    skip: !receiverId,
  });
  const receiverInfo = result?.data?.attributes;

  // Fetch messages for page 1 (latest messages)
  const { data: latestMessagesData, isLoading: latestMessagesLoading } =
    useGetMessagesQuery(
      {
        receiverId,
        filters: [
          { key: "page", value: 1 },
          { key: "limit", value: limit },
        ],
      },
      {
        refetchOnMountOrArgChange: true,
        pollingInterval: 30000,
        skip: !receiverId,
      }
    );

  // Use query to fetch messages
  const {
    data: responseData,
    isLoading: messagesLoading,
    isFetching,
  } = useGetMessagesQuery(
    {
      receiverId,
      filters: [
        { key: "page", value: currentPage },
        { key: "limit", value: limit },
      ],
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !receiverId || currentPage === 1,
    }
  );

  const currentPageMessages = responseData?.data?.attributes?.results;
  const latestMessages = latestMessagesData?.data?.attributes?.results;
  const totalPages =
    latestMessagesData?.data?.attributes?.totalPages ||
    responseData?.data?.attributes?.totalPages ||
    0;

  // Reset state when receiverId changes
  useEffect(() => {
    setCurrentPage(1);
    setAllLoadedMessages([]);
    setHasMore(true);
    setIsInitialLoad(true);
    setIsLoadingMore(false);
    setShouldScrollToBottom(true);
    setShowScrollToBottom(false);
  }, [receiverId]);

  useEffect(() => {
    if (latestMessages?.length > 0) {
      setAllLoadedMessages((prev) => {
        const existingIds = new Set(prev.map((msg) => msg._id));
        const newMessages = latestMessages.filter(
          (msg: IMessage) => !existingIds.has(msg._id)
        );

        if (newMessages.length === 0 && !isInitialLoad) return prev;

        const isNewMessageAdded = newMessages.some(
          (msg: IMessage) =>
            msg.senderId === user?._id ||
            (prev.length > 0 &&
              msg?.createdAt &&
              prev[prev.length - 1]?.createdAt &&
              new Date(msg.createdAt) > new Date(prev[prev.length - 1].createdAt as Date))
        );

        if (isInitialLoad) {
          setShouldScrollToBottom(true);
          return newMessages;
        } else {
          const updatedMessages = [...prev, ...newMessages].filter(
            (msg, index, self) =>
              index === self.findIndex((m) => m._id === msg._id)
          );

          updatedMessages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          if (isNewMessageAdded) {
            setShouldScrollToBottom(true);
          } else {
            setShouldScrollToBottom(false); // Avoid auto-scroll for old messages
          }

          return updatedMessages;
        }
      });

      setHasMore(currentPage < totalPages);
      setIsInitialLoad(false);
    }
  }, [latestMessages, isInitialLoad, user?._id, currentPage, totalPages]);

  useEffect(() => {
    if (currentPageMessages?.length > 0 && currentPage > 1) {
      const previousScrollHeight = scrollRef.current?.scrollHeight || 0;
      const previousScrollTop = scrollRef.current?.scrollTop || 0;

      setAllLoadedMessages((prev) => {
        const existingIds = new Set(prev.map((msg) => msg._id));
        const newMessages = currentPageMessages.filter(
          (msg: IMessage) => !existingIds.has(msg._id)
        );

        if (newMessages.length === 0) {
          setHasMore(false);
          setIsLoadingMore(false);
          return prev;
        }

        const updatedMessages = [...newMessages, ...prev].filter(
          (msg, index, self) =>
            index === self.findIndex((m) => m._id === msg._id)
        );

        updatedMessages.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setTimeout(() => {
          if (scrollRef.current) {
            const newScrollHeight = scrollRef.current.scrollHeight;
            scrollRef.current.scrollTop =
              previousScrollTop + (newScrollHeight - previousScrollHeight);
          }
        }, 50);

        return updatedMessages;
      });

      setHasMore(currentPage < totalPages);
      setIsLoadingMore(false);
    } else if (!messagesLoading && !isFetching && currentPage > 1) {
      setHasMore(false);
      setIsLoadingMore(false);
    }
  }, [
    currentPageMessages,
    currentPage,
    totalPages,
    messagesLoading,
    isFetching,
  ]);

  // Group messages by date
  const groupedMessages = useMemo(() => {
    return groupMessagesByDate(allLoadedMessages);
  }, [allLoadedMessages]);

  const openLightbox = (images: string[]) => {
    setLightboxImages(images);
    setLightboxOpen(true);
  };

  // Load more messages
  const loadMoreMessages = useCallback(() => {
    if (
      !isLoadingMore &&
      !messagesLoading &&
      !isFetching &&
      hasMore &&
      currentPage < totalPages
    ) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  }, [
    isLoadingMore,
    messagesLoading,
    isFetching,
    hasMore,
    currentPage,
    totalPages,
  ]);

  // Debounced scroll handler
  const debouncedHandleScroll = useMemo(
    () =>
      debounce(() => {
        if (!scrollRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

        // Show scroll-to-bottom button when scrolled up significantly
        setShowScrollToBottom(scrollTop < scrollHeight - clientHeight - 200);

        // Load more messages when near top
        if (
          scrollTop <= 50 &&
          hasMore &&
          !isLoadingMore &&
          !messagesLoading &&
          !isFetching
        ) {
          loadMoreMessages();
        }

        // Disable auto-scroll when user scrolls up
        if (scrollTop < scrollHeight - clientHeight - 100) {
          setShouldScrollToBottom(false);
        }
      }, 100),
    [hasMore, isLoadingMore, messagesLoading, isFetching, loadMoreMessages]
  );

  // Attach scroll event listener
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (
      shouldScrollToBottom &&
      scrollRef.current &&
      allLoadedMessages.length > 0
    ) {
      const timeoutId = setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
          });
        }

        // Focus input field
        const inputField = document.getElementById(
          "input-message"
        ) as HTMLTextAreaElement | null;
        if (inputField) {
          inputField.focus();
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [shouldScrollToBottom, allLoadedMessages?.length]);

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="flex justify-center py-4">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    </div>
  );
  const isLoading =
    (latestMessagesLoading && isInitialLoad) ||
    (messagesLoading && currentPage > 1);

  return (
    <div className="w-full relative h-[calc(85vh-200px)] ">
      <div
        ref={scrollRef}
        className="w-full h-full overflow-x-hidden overflow-y-auto p-4 space-y-5 messages-box"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Loading indicator at top */}
        {(isLoadingMore || (messagesLoading && !isInitialLoad)) && (
          <LoadingIndicator />
        )}

        {/* Initial loading skeleton */}
        {isLoading ? (
          <MessageLoadingSkeleton />
        ) : (
          <div className="space-y-5">
            {Object.keys(groupedMessages)
              .sort()
              .map((dateKey) => {
                const messagesForDate = groupedMessages[dateKey];
                const dateLabel = getDateGroupLabel(
                  messagesForDate[0].createdAt as Date
                );

                return (
                  <div key={dateKey}>
                    <DateSeparator label={dateLabel} />
                    <div className="space-y-3">
                      {messagesForDate.map((message: IMessage) => {
                        const isMyMessage = message?.senderId === user?._id;
                        return (
                          <MessageItem
                            key={message?._id}
                            message={message}
                            isMyMessage={isMyMessage}
                            receiverInfo={receiverInfo}
                            onOpenLightbox={openLightbox}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <button
          onClick={() => setShouldScrollToBottom(true)}
          className="absolute bottom-4 cursor-pointer right-4 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          title="Scroll to bottom"
          aria-label="Scroll to bottom"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      )}
      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxImages.map((url) => ({ src: url }))}
        />
      )}
    </div>
  );
};

export default MessageBody;