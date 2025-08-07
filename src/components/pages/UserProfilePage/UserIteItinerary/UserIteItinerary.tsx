"use client";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useGetSavedPostQuery } from "@/redux/features/savedPost/savedPost.api";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import UserIteItineraryCard from "./UserIteItineraryCard";
import UserTimelineSkeletonCard from "../UserTimeline/UserTimelineSkeletonCard";
import { ChevronDown } from "lucide-react";

const UserIteItinerary = () => {
  const { userName } = useParams();
  const [activeTab, setActiveTab] = useState<"myItinerary" | "savedItinerary">("myItinerary");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // My itinerary states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itineraryPosts, setItineraryPosts] = useState<IPost[]>([]);
  const [removePostIds, setRemovePostIds] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Saved itinerary states
  const [savedCurrentPage, setSavedCurrentPage] = useState<number>(1);
  const [savedItineraryPosts, setSavedItineraryPosts] = useState<IPost[]>([]);
  const [savedHasMore, setSavedHasMore] = useState(true);
  const [savedLoading, setSavedLoading] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);

  const username =
    typeof userName === "string"
      ? userName
      : Array.isArray(userName)
      ? userName[0]
      : "";

  const sortOptions = [
    { label: "Recently Added", value: "createdAt" },
    { label: "Oldest First", value: "-createdAt" },
    { label: "Name (A-Z)", value: "fullName" },
    { label: "Name (Z-A)", value: "-fullName" },
  ];

  // Get user itinerary posts
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetUserTimelinePostsQuery(
    {
      username,
      filters: [
        { key: "mediaType", value: "itinerary" },
        { key: "page", value: currentPage.toString() },
        { key: "limit", value: "9" },
        { key: "sortBy", value: sortBy },
      ],
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !username || activeTab !== "myItinerary",
    }
  );

  // Get saved itinerary posts
  const {
    data: savedResponseData,
    isLoading: isSavedLoading,
    isFetching: isSavedFetching,
  } = useGetSavedPostQuery(
    [
      { key: "mediaType", value: "itinerary" },
      { key: "page", value: savedCurrentPage.toString() },
      { key: "limit", value: "9" },
      { key: "sortBy", value: sortBy },
    ],
    {
      refetchOnMountOrArgChange: true,
      skip: activeTab !== "savedItinerary",
    }
  );

  // Get current page posts from RTK Query cache
  const currentPagePosts = useMemo(
    () =>
      Array.isArray(responseData?.data?.attributes?.results)
        ? (responseData.data.attributes.results as IPost[])
        : [],
    [responseData]
  );

  const currentPageSavedPosts = useMemo(
    () =>
      Array.isArray(savedResponseData?.data?.attributes?.results)
        ? (savedResponseData.data.attributes.results as IPost[])
        : [],
    [savedResponseData]
  );

  const totalPages = responseData?.data?.attributes?.totalPages;
  const savedTotalPages = savedResponseData?.data?.attributes?.totalPages;

  // Add new posts to itineraryPosts when currentPage-posts changes
  useEffect(() => {
    if (currentPagePosts?.length > 0) {
      if (currentPage === 1) {
        // Reset posts for first page
        setItineraryPosts(
          currentPagePosts.filter((post) => !removePostIds.includes(post._id))
        );
      } else {
        // Append new posts, avoiding duplicates and removed posts
        setItineraryPosts((prevPosts) => {
          const existingIds = new Set(prevPosts?.map((post) => post?._id));
          const newPosts = currentPagePosts?.filter(
            (post) =>
              !existingIds.has(post._id) && !removePostIds.includes(post._id)
          );
          return [...prevPosts, ...newPosts];
        });
      }
    }
  }, [currentPagePosts, currentPage, removePostIds]);

  // Add new saved posts when currentPageSavedPosts changes
  useEffect(() => {
    if (currentPageSavedPosts?.length > 0) {
      if (savedCurrentPage === 1) {
        setSavedItineraryPosts(currentPageSavedPosts);
      } else {
        setSavedItineraryPosts((prevPosts) => {
          const existingIds = new Set(prevPosts?.map((post) => post?._id));
          const newPosts = currentPageSavedPosts?.filter(
            (post) => !existingIds.has(post._id)
          );
          return [...prevPosts, ...newPosts];
        });
      }
    }
  }, [currentPageSavedPosts, savedCurrentPage]);

  // Handle real-time updates: merge updated posts from RTK Query cache
  useEffect(() => {
    if (currentPagePosts?.length > 0 && itineraryPosts?.length > 0) {
      setItineraryPosts((prevPosts) => {
        return prevPosts?.map((existingPost) => {
          const updatedPost = currentPagePosts?.find(
            (p) => p?._id === existingPost?._id
          );
          return updatedPost || existingPost;
        });
      });
    }
  }, [currentPagePosts, itineraryPosts?.length]);

  // Handle real-time updates for saved posts
  useEffect(() => {
    if (currentPageSavedPosts?.length > 0 && savedItineraryPosts?.length > 0) {
      setSavedItineraryPosts((prevPosts) => {
        return prevPosts?.map((existingPost) => {
          const updatedPost = currentPageSavedPosts?.find(
            (p) => p?._id === existingPost?._id
          );
          return updatedPost || existingPost;
        });
      });
    }
  }, [currentPageSavedPosts, savedItineraryPosts?.length]);

  // Update loading and hasMore states for my itinerary
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
      setHasMore(currentPage < (totalPages || 0));
    }
  }, [isLoading, currentPage, totalPages]);

  // Update loading and hasMore states for saved itinerary
  useEffect(() => {
    if (isSavedLoading) {
      setSavedLoading(true);
    } else {
      setSavedLoading(false);
      setSavedHasMore(savedCurrentPage < (savedTotalPages || 0));
    }
  }, [isSavedLoading, savedCurrentPage, savedTotalPages]);

  // Reset itinerary posts and removed post IDs when username changes
  useEffect(() => {
    setItineraryPosts([]);
    setRemovePostIds([]);
    setCurrentPage(1);
    setHasMore(true);
    setSavedItineraryPosts([]);
    setSavedCurrentPage(1);
    setSavedHasMore(true);
  }, [username]);

  // Reset data when sortBy changes
  useEffect(() => {
    if (activeTab === "myItinerary") {
      setItineraryPosts([]);
      setCurrentPage(1);
      setHasMore(true);
    } else {
      setSavedItineraryPosts([]);
      setSavedCurrentPage(1);
      setSavedHasMore(true);
    }
  }, [sortBy, activeTab]);

  // Load more posts function
  const loadMore = useCallback(() => {
    if (activeTab === "myItinerary") {
      if (!loading && hasMore) {
        setCurrentPage((prev) => prev + 1);
      }
    } else {
      if (!savedLoading && savedHasMore) {
        setSavedCurrentPage((prev) => prev + 1);
      }
    }
  }, [loading, hasMore, savedLoading, savedHasMore, activeTab]);

  // Set up IntersectionObserver for infinite scroll (last post)
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if ((activeTab === "myItinerary" && (isLoading || isFetching)) || 
          (activeTab === "savedItinerary" && (isSavedLoading || isSavedFetching))) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (activeTab === "myItinerary" && hasMore) {
            setCurrentPage((prevPage) => prevPage + 1);
          } else if (activeTab === "savedItinerary" && savedHasMore) {
            setSavedCurrentPage((prevPage) => prevPage + 1);
          }
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, isSavedLoading, isSavedFetching, hasMore, savedHasMore, activeTab]
  );

  // Infinite scroll with IntersectionObserver (for sentinel)
  useEffect(() => {
    const currentHasMore = activeTab === "myItinerary" ? hasMore : savedHasMore;
    const currentLoading = activeTab === "myItinerary" ? loading : savedLoading;
    
    if (!currentHasMore || currentLoading) return;

    const observerInstance = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.11 }
    );

    const sentinel = document.getElementById("sentinel");
    if (sentinel) observerInstance.observe(sentinel);

    return () => {
      if (sentinel) observerInstance.unobserve(sentinel);
    };
  }, [loadMore, loading, hasMore, savedLoading, savedHasMore, activeTab]);

  // Handle tab change
  const handleTabChange = (tab: "myItinerary" | "savedItinerary") => {
    setActiveTab(tab);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setShowSortDropdown(false);
  };

  const handleRemovePost = (postId: string) => {
    if (activeTab === "myItinerary") {
      setRemovePostIds((prev) => [...prev, postId]);
      setItineraryPosts((prev) => prev.filter((post) => post._id !== postId));
    } else {
      setSavedItineraryPosts((prev) => prev.filter((post) => post._id !== postId));
    }
  };

  const currentPosts = activeTab === "myItinerary" ? itineraryPosts : savedItineraryPosts;
  const currentLoading = activeTab === "myItinerary" ? isLoading : isSavedLoading;
  const currentFetching = activeTab === "myItinerary" ? isFetching : isSavedFetching;
  const currentHasMore = activeTab === "myItinerary" ? hasMore : savedHasMore;

  const renderTabsAndSort = () => (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
      <div className="flex space-x-4">
        <button
          onClick={() => handleTabChange("myItinerary")}
          className={`px-6 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
            activeTab === "myItinerary" &&
            "bg-[#E9F8F9] border border-primary text-primary"
          }`}
        >
          My Itinerary
        </button>
        <button
          onClick={() => handleTabChange("savedItinerary")}
          className={`px-6 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
            activeTab === "savedItinerary" &&
            "bg-[#E9F8F9] border border-primary text-primary"
          }`}
        >
          Saved Itinerary
        </button>
      </div>
      
      <div className="relative">
        <button
          onClick={() => setShowSortDropdown(!showSortDropdown)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary focus:border-primary transition-colors"
        >
          {sortOptions.find(option => option.value === sortBy)?.label || "Sort By"}
          <ChevronDown className="w-4 h-4" />
        </button>
        {showSortDropdown && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-48">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                  sortBy === option.value ? "bg-primary/5 text-primary" : ""
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <UserTimelineSkeletonCard key={`skeleton-${index}`} />
      ))}
    </div>
  );

  let content = null;
  if (currentLoading && currentPosts?.length === 0) {
    content = renderLoading();
  } else if (currentPosts.length === 0 && !currentHasMore) {
    content = (
      <h1 className="text-center text-gray-500 py-8">
        {activeTab === "myItinerary" ? "No itinerary available" : "No saved itinerary available"}
      </h1>
    );
  } else if (currentPosts.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentPosts.map((post, index) => {
          // Attach ref to the last post for infinite scroll
          if (index === currentPosts.length - 1) {
            return (
              <div key={post._id} ref={lastPostElementRef}>
                <UserIteItineraryCard
                  post={post}
                  onRemove={() => handleRemovePost(post._id)}
                />
              </div>
            );
          }
          return (
            <UserIteItineraryCard
              key={post._id}
              post={post}
              onRemove={() => handleRemovePost(post._id)}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {renderTabsAndSort()}
      {content}
      {currentFetching && currentHasMore && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <UserTimelineSkeletonCard key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div id="sentinel" style={{ height: "1px" }} />
    </div>
  );
};

export default UserIteItinerary;
