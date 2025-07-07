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
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [allLoadedMessages, setAllLoadedMessages] = useState<IMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const limit = 15;

  const { data: result } = useGetSingleByUserIdQuery(receiverId, {
    refetchOnMountOrArgChange: true,
    skip: !receiverId,
  });
  const receiverInfo = result?.data?.attributes;

  // Fetch messages for current page (starts with page 1)
  const { data: responseData, isLoading: messagesLoading, isFetching } =
    useGetMessagesQuery(
      {
        receiverId,
        filters: [
          { key: "page", value: currentPage },
          { key: "limit", value: limit },
        ],
      },
      {
        refetchOnMountOrArgChange: true,
        pollingInterval: currentPage === 1 ? 5000 : 0, // Only poll for latest messages
        skip: !receiverId,
      }
    );

  const currentPageMessages = responseData?.data?.attributes?.results;
  const totalPages = responseData?.data?.attributes?.totalPages || 0;

  // IntersectionObserver callback for loading older messages when scrolling to top
  const loadMoreTriggerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore || messagesLoading || isFetching || isInitialLoad) return;
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && currentPage < totalPages) {
            setIsLoadingMore(true);
            setCurrentPage((prev) => prev + 1);
          }
        },
        {
          threshold: 0.1,
          rootMargin: '20px',
        }
      );
      
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoadingMore, messagesLoading, isFetching, hasMore, currentPage, totalPages, isInitialLoad]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

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

  // Handle messages data - for page 1 and subsequent pages
  useEffect(() => {
    if (currentPageMessages?.length > 0) {
      if (currentPage === 1) {
        // First page - latest messages, replace all and scroll to bottom
        const sortedMessages = [...currentPageMessages].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setAllLoadedMessages(sortedMessages);
        setShouldScrollToBottom(true);
        setIsInitialLoad(false);
      } else {
        // Subsequent pages - older messages, prepend to existing messages
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

          // Prepend older messages to the beginning
          const updatedMessages = [...newMessages, ...prev].filter(
            (msg, index, self) =>
              index === self.findIndex((m) => m._id === msg._id)
          );

          // Sort all messages by date
          updatedMessages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          // Maintain scroll position after adding older messages
          setTimeout(() => {
            if (scrollRef.current) {
              const newScrollHeight = scrollRef.current.scrollHeight;
              scrollRef.current.scrollTop =
                previousScrollTop + (newScrollHeight - previousScrollHeight);
            }
          }, 50);

          return updatedMessages;
        });

        setIsLoadingMore(false);
      }

      setHasMore(currentPage < totalPages);
    } else if (!messagesLoading && !isFetching) {
      if (currentPage === 1) {
        setAllLoadedMessages([]);
        setIsInitialLoad(false);
      }
      setHasMore(false);
      setIsLoadingMore(false);
    }
  }, [currentPageMessages, currentPage, totalPages, messagesLoading, isFetching]);

  // Group messages by date
  const groupedMessages = useMemo(() => {
    return groupMessagesByDate(allLoadedMessages);
  }, [allLoadedMessages]);

  const openLightbox = (images: string[]) => {
    setLightboxImages(images);
    setLightboxOpen(true);
  };

  // Debounced scroll handler for showing scroll-to-bottom button
  const debouncedHandleScroll = useMemo(
    () =>
      debounce(() => {
        if (!scrollRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

        // Show scroll-to-bottom button when scrolled up significantly
        setShowScrollToBottom(scrollTop < scrollHeight - clientHeight - 200);

        // Disable auto-scroll when user scrolls up
        if (scrollTop < scrollHeight - clientHeight - 100) {
          setShouldScrollToBottom(false);
        }
      }, 100),
    []
  );

  // Attach scroll event listener only for scroll-to-bottom button
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

  const isLoading = messagesLoading && isInitialLoad;

  return (
    <div className="w-full h-full relative">
      <div
        ref={scrollRef}
        className="w-full h-full overflow-x-hidden overflow-y-auto p-4 space-y-5 messages-box"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Intersection Observer trigger element for loading older messages at top */}
        {hasMore && !isInitialLoad && allLoadedMessages.length > 0 && (
          <div
            ref={loadMoreTriggerRef}
            className="flex justify-center py-2"
          >
            <div className="h-1 w-full bg-transparent" />
          </div>
        )}

        {/* Loading indicator at top for older messages */}
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