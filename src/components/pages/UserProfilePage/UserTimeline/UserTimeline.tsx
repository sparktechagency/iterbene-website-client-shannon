"use client";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useGetSavedPostQuery } from "@/redux/features/savedPost/savedPost.api";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import UserTimelineCard from "./UserTimelineCard";
import UserTimelineSkeletonCard from "./UserTimelineSkeletonCard";
import { ChevronDown } from "lucide-react";

const UserTimeline = () => {
  const [activeTab, setActiveTab] = useState<"myTimeline" | "savedTimeline">("myTimeline");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Timeline states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [timelinePosts, setTimelinePosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Saved timeline states
  const [savedCurrentPage, setSavedCurrentPage] = useState<number>(1);
  const [savedPosts, setSavedPosts] = useState<IPost[]>([]);
  const [savedHasMore, setSavedHasMore] = useState(true);
  const [savedLoading, setSavedLoading] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const { userName } = useParams();
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

  // Timeline posts query
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetUserTimelinePostsQuery(
    {
      username,
      filters: [
        { key: "page", value: currentPage.toString() },
        { key: "limit", value: "9" },
        { key: "sortBy", value: sortBy },
      ],
    },
    { refetchOnMountOrArgChange: true, skip: !username || activeTab !== "myTimeline" }
  );

  // Saved posts query
  const {
    data: savedResponseData,
    isLoading: isSavedLoading,
    isFetching: isSavedFetching,
  } = useGetSavedPostQuery(
    [
      { key: "page", value: savedCurrentPage.toString() },
      { key: "limit", value: "9" },
      { key: "sortBy", value: sortBy },
    ],
    { refetchOnMountOrArgChange: true, skip: activeTab !== "savedTimeline" }
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

  // Add new posts to timelinePosts when currentPagePosts changes
  useEffect(() => {
    if (currentPagePosts?.length > 0) {
      if (currentPage === 1) {
        // Reset posts for first page
        setTimelinePosts(currentPagePosts);
      } else {
        // Append new posts, avoiding duplicates
        setTimelinePosts((prevPosts) => {
          const existingIds = new Set(prevPosts?.map((post) => post?._id));
          const newPosts = currentPagePosts?.filter(
            (post) => !existingIds.has(post._id)
          );
          return [...prevPosts, ...newPosts];
        });
      }
    }
  }, [currentPagePosts, currentPage]);

  // Add new saved posts when currentPageSavedPosts changes
  useEffect(() => {
    if (currentPageSavedPosts?.length > 0) {
      if (savedCurrentPage === 1) {
        setSavedPosts(currentPageSavedPosts);
      } else {
        setSavedPosts((prevPosts) => {
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
    if (currentPagePosts?.length > 0 && timelinePosts?.length > 0) {
      setTimelinePosts((prevPosts) => {
        return prevPosts?.map((existingPost) => {
          const updatedPost = currentPagePosts?.find(
            (p) => p?._id === existingPost?._id
          );
          return updatedPost || existingPost;
        });
      });
    }
  }, [currentPagePosts, timelinePosts?.length]);

  // Handle real-time updates for saved posts
  useEffect(() => {
    if (currentPageSavedPosts?.length > 0 && savedPosts?.length > 0) {
      setSavedPosts((prevPosts) => {
        return prevPosts?.map((existingPost) => {
          const updatedPost = currentPageSavedPosts?.find(
            (p) => p?._id === existingPost?._id
          );
          return updatedPost || existingPost;
        });
      });
    }
  }, [currentPageSavedPosts, savedPosts?.length]);

  // Update loading and hasMore states for timeline
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
      setHasMore(currentPage < (totalPages || 0));
    }
  }, [isLoading, currentPage, totalPages]);

  // Update loading and hasMore states for saved posts
  useEffect(() => {
    if (isSavedLoading) {
      setSavedLoading(true);
    } else {
      setSavedLoading(false);
      setSavedHasMore(savedCurrentPage < (savedTotalPages || 0));
    }
  }, [isSavedLoading, savedCurrentPage, savedTotalPages]);

  // Reset timeline posts when username changes
  useEffect(() => {
    setTimelinePosts([]);
    setCurrentPage(1);
    setHasMore(true);
    setSavedPosts([]);
    setSavedCurrentPage(1);
    setSavedHasMore(true);
  }, [username]);

  // Reset data when sortBy changes
  useEffect(() => {
    if (activeTab === "myTimeline") {
      setTimelinePosts([]);
      setCurrentPage(1);
      setHasMore(true);
    } else {
      setSavedPosts([]);
      setSavedCurrentPage(1);
      setSavedHasMore(true);
    }
  }, [sortBy, activeTab]);

  // Load more posts function
  const loadMore = useCallback(() => {
    if (activeTab === "myTimeline") {
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
      if ((activeTab === "myTimeline" && (isLoading || isFetching)) || 
          (activeTab === "savedTimeline" && (isSavedLoading || isSavedFetching))) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (activeTab === "myTimeline" && hasMore) {
            setCurrentPage((prevPage) => prevPage + 1);
          } else if (activeTab === "savedTimeline" && savedHasMore) {
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
    const currentHasMore = activeTab === "myTimeline" ? hasMore : savedHasMore;
    const currentLoading = activeTab === "myTimeline" ? loading : savedLoading;
    
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
  const handleTabChange = (tab: "myTimeline" | "savedTimeline") => {
    setActiveTab(tab);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setShowSortDropdown(false);
  };

  const currentPosts = activeTab === "myTimeline" ? timelinePosts : savedPosts;
  const currentLoading = activeTab === "myTimeline" ? isLoading : isSavedLoading;
  const currentFetching = activeTab === "myTimeline" ? isFetching : isSavedFetching;
  const currentHasMore = activeTab === "myTimeline" ? hasMore : savedHasMore;

  // Show loading skeletons for initial load
  if (currentLoading && currentPosts?.length === 0) {
    return (
      <div>
        {/* Tabs and Sort Dropdown */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
          <div className="flex space-x-4">
            <button
              onClick={() => handleTabChange("myTimeline")}
              className={`px-6 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeTab === "myTimeline" &&
                "bg-[#E9F8F9] border border-primary text-primary"
              }`}
            >
              My Timeline
            </button>
            <button
              onClick={() => handleTabChange("savedTimeline")}
              className={`px-6 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeTab === "savedTimeline" &&
                "bg-[#E9F8F9] border border-primary text-primary"
              }`}
            >
              Saved Timeline
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
        
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <UserTimelineSkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  // Show "Not available" message if no posts
  if (!currentLoading && currentPosts?.length === 0 && !currentHasMore) {
    return (
      <div>
        {/* Tabs and Sort Dropdown */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
          <div className="flex space-x-4">
            <button
              onClick={() => handleTabChange("myTimeline")}
              className={`px-6 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeTab === "myTimeline" &&
                "bg-[#E9F8F9] border border-primary text-primary"
              }`}
            >
              My Timeline
            </button>
            <button
              onClick={() => handleTabChange("savedTimeline")}
              className={`px-6 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeTab === "savedTimeline" &&
                "bg-[#E9F8F9] border border-primary text-primary"
              }`}
            >
              Saved Timeline
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
        
        <h1 className="text-center text-gray-500 py-8">
          {activeTab === "myTimeline" ? "No posts available" : "No saved posts available"}
        </h1>
      </div>
    );
  }

  return (
    <div>
      {/* Tabs and Sort Dropdown */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
        <div className="flex space-x-4">
          <button
            onClick={() => handleTabChange("myTimeline")}
            className={`px-6 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === "myTimeline" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            My Timeline
          </button>
          <button
            onClick={() => handleTabChange("savedTimeline")}
            className={`px-6 py-2 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === "savedTimeline" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            Saved Timeline
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
              ))
            }
          </div>
          )}
        </div>
      </div>
      
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {currentPosts?.map((post, index) => {
          // Attach ref to the last post for infinite scroll
          if (index === currentPosts?.length - 1) {
            return (
              <div key={post?._id} ref={lastPostElementRef}>
                <UserTimelineCard 
                  post={post} 
                  setTimelinePosts={activeTab === "myTimeline" ? setTimelinePosts : setSavedPosts} 
                />
              </div>
            );
          }
          return (
            <UserTimelineCard 
              key={post?._id} 
              post={post} 
              setTimelinePosts={activeTab === "myTimeline" ? setTimelinePosts : setSavedPosts} 
            />
          );
        })}
      </div>
      {currentFetching && currentHasMore && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <UserTimelineSkeletonCard key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div id="sentinel" style={{ height: "1px" }} />
    </div>
  );
};

export default UserTimeline;
