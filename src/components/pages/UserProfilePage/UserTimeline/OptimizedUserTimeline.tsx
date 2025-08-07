"use client";
import React, { useEffect, useMemo, useCallback, useReducer } from "react";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useGetSavedPostQuery } from "@/redux/features/savedPost/savedPost.api";
import { IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import UserTimelineCard from "./UserTimelineCard";
import UserTimelineSkeletonCard from "./UserTimelineSkeletonCard";
import { useUnifiedTabs } from "@/hooks/useUnifiedTabs";
import { useOptimizedInfiniteScroll } from "@/hooks/useOptimizedInfiniteScroll";
import SortSelector, { COMMON_SORT_OPTIONS } from "@/components/common/SortSelector";

interface TimelineState {
  timelinePosts: IPost[];
  savedPosts: IPost[];
  currentPage: number;
  savedCurrentPage: number;
  hasMore: boolean;
  savedHasMore: boolean;
  sortBy: string;
}

// Reducer for state management
type TimelineAction = 
  | { type: 'SET_TIMELINE_POSTS'; payload: IPost[] }
  | { type: 'APPEND_TIMELINE_POSTS'; payload: IPost[] }
  | { type: 'SET_SAVED_POSTS'; payload: IPost[] }
  | { type: 'APPEND_SAVED_POSTS'; payload: IPost[] }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_SAVED_CURRENT_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_SAVED_HAS_MORE'; payload: boolean }
  | { type: 'SET_SORT_BY'; payload: string }
  | { type: 'RESET_FOR_NEW_SORT' }
  | { type: 'UPDATE_TIMELINE_POST'; payload: IPost };

const timelineReducer = (state: TimelineState, action: TimelineAction): TimelineState => {
  switch (action.type) {
    case 'SET_TIMELINE_POSTS':
      return { ...state, timelinePosts: action.payload };
    case 'APPEND_TIMELINE_POSTS': {
      const existingIds = new Set(state.timelinePosts.map(post => post._id));
      const newPosts = action.payload.filter(post => !existingIds.has(post._id));
      return { ...state, timelinePosts: [...state.timelinePosts, ...newPosts] };
    }
    case 'SET_SAVED_POSTS':
      return { ...state, savedPosts: action.payload };
    case 'APPEND_SAVED_POSTS': {
      const existingIds = new Set(state.savedPosts.map(post => post._id));
      const newPosts = action.payload.filter(post => !existingIds.has(post._id));
      return { ...state, savedPosts: [...state.savedPosts, ...newPosts] };
    }
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_SAVED_CURRENT_PAGE':
      return { ...state, savedCurrentPage: action.payload };
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
    case 'SET_SAVED_HAS_MORE':
      return { ...state, savedHasMore: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'RESET_FOR_NEW_SORT':
      return {
        ...state,
        timelinePosts: [],
        savedPosts: [],
        currentPage: 1,
        savedCurrentPage: 1,
        hasMore: true,
        savedHasMore: true
      };
    case 'UPDATE_TIMELINE_POST':
      return {
        ...state,
        timelinePosts: state.timelinePosts.map(post => 
          post._id === action.payload._id ? action.payload : post
        ),
        savedPosts: state.savedPosts.map(post => 
          post._id === action.payload._id ? action.payload : post
        )
      };
    default:
      return state;
  }
};

const initialState: TimelineState = {
  timelinePosts: [],
  savedPosts: [],
  currentPage: 1,
  savedCurrentPage: 1,
  hasMore: true,
  savedHasMore: true,
  sortBy: "createdAt"
};

const OptimizedUserTimeline = () => {
  const [state, dispatch] = useReducer(timelineReducer, initialState);
  const { userName } = useParams();
  
  const username = typeof userName === "string" ? userName : 
                   Array.isArray(userName) ? userName[0] : "";

  // Unified tab management
  const { activeTab, renderTabButtons } = useUnifiedTabs({
    tabs: [
      { key: "myTimeline", label: "My Timeline" },
      { key: "savedTimeline", label: "Saved Timeline" }
    ],
    defaultTab: "myTimeline",
    onTabChange: () => {
      // Reset scroll position on tab change
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });

  // Timeline posts query
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetUserTimelinePostsQuery(
    {
      username,
      filters: [
        { key: "page", value: state.currentPage.toString() },
        { key: "limit", value: "9" },
        { key: "sortBy", value: state.sortBy },
      ],
    },
    { 
      refetchOnMountOrArgChange: true, 
      skip: !username || activeTab !== "myTimeline" 
    }
  );

  // Saved posts query
  const {
    data: savedResponseData,
    isLoading: isSavedLoading,
    isFetching: isSavedFetching,
  } = useGetSavedPostQuery(
    [
      { key: "page", value: state.savedCurrentPage.toString() },
      { key: "limit", value: "9" },
      { key: "sortBy", value: state.sortBy },
    ],
    { 
      refetchOnMountOrArgChange: true, 
      skip: activeTab !== "savedTimeline" 
    }
  );

  // Memoized current page posts
  const currentPagePosts = useMemo(() =>
    Array.isArray(responseData?.data?.attributes?.results)
      ? (responseData.data.attributes.results as IPost[])
      : [],
    [responseData]
  );

  const currentPageSavedPosts = useMemo(() =>
    Array.isArray(savedResponseData?.data?.attributes?.results)
      ? (savedResponseData.data.attributes.results as IPost[])
      : [],
    [savedResponseData]
  );

  // Handle timeline posts data
  useEffect(() => {
    if (currentPagePosts.length > 0) {
      if (state.currentPage === 1) {
        dispatch({ type: 'SET_TIMELINE_POSTS', payload: currentPagePosts });
      } else {
        dispatch({ type: 'APPEND_TIMELINE_POSTS', payload: currentPagePosts });
      }
    }
  }, [currentPagePosts, state.currentPage]);

  // Handle saved posts data
  useEffect(() => {
    if (currentPageSavedPosts.length > 0) {
      if (state.savedCurrentPage === 1) {
        dispatch({ type: 'SET_SAVED_POSTS', payload: currentPageSavedPosts });
      } else {
        dispatch({ type: 'APPEND_SAVED_POSTS', payload: currentPageSavedPosts });
      }
    }
  }, [currentPageSavedPosts, state.savedCurrentPage]);

  // Update hasMore flags
  useEffect(() => {
    const totalPages = responseData?.data?.attributes?.totalPages || 1;
    dispatch({ type: 'SET_HAS_MORE', payload: state.currentPage < totalPages });
  }, [responseData, state.currentPage]);

  useEffect(() => {
    const savedTotalPages = savedResponseData?.data?.attributes?.totalPages || 1;
    dispatch({ type: 'SET_SAVED_HAS_MORE', payload: state.savedCurrentPage < savedTotalPages });
  }, [savedResponseData, state.savedCurrentPage]);

  // Handle sort change
  const handleSortChange = useCallback((value: string) => {
    dispatch({ type: 'SET_SORT_BY', payload: value });
    dispatch({ type: 'RESET_FOR_NEW_SORT' });
  }, []);

  // Load more callback for infinite scroll
  const loadMoreTimeline = useCallback(() => {
    if (!isLoading && !isFetching && state.hasMore) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: state.currentPage + 1 });
    }
  }, [isLoading, isFetching, state.hasMore, state.currentPage]);

  const loadMoreSaved = useCallback(() => {
    if (!isSavedLoading && !isSavedFetching && state.savedHasMore) {
      dispatch({ type: 'SET_SAVED_CURRENT_PAGE', payload: state.savedCurrentPage + 1 });
    }
  }, [isSavedLoading, isSavedFetching, state.savedHasMore, state.savedCurrentPage]);

  // Infinite scroll for timeline
  const { lastElementRef: timelineLastRef, sentinelRef: timelineSentinelRef } = useOptimizedInfiniteScroll({
    isLoading,
    isFetching,
    hasMore: state.hasMore,
    onLoadMore: loadMoreTimeline,
    enabled: activeTab === "myTimeline"
  });

  // Infinite scroll for saved posts
  const { lastElementRef: savedLastRef, sentinelRef: savedSentinelRef } = useOptimizedInfiniteScroll({
    isLoading: isSavedLoading,
    isFetching: isSavedFetching,
    hasMore: state.savedHasMore,
    onLoadMore: loadMoreSaved,
    enabled: activeTab === "savedTimeline"
  });

  // Current data based on active tab
  const currentData = useMemo(() => ({
    posts: activeTab === "myTimeline" ? state.timelinePosts : state.savedPosts,
    isLoading: activeTab === "myTimeline" ? isLoading : isSavedLoading,
    isFetching: activeTab === "myTimeline" ? isFetching : isSavedFetching,
    hasMore: activeTab === "myTimeline" ? state.hasMore : state.savedHasMore,
    lastElementRef: activeTab === "myTimeline" ? timelineLastRef : savedLastRef,
    sentinelRef: activeTab === "myTimeline" ? timelineSentinelRef : savedSentinelRef
  }), [
    activeTab, 
    state.timelinePosts, 
    state.savedPosts, 
    isLoading, 
    isSavedLoading,
    isFetching,
    isSavedFetching,
    state.hasMore,
    state.savedHasMore,
    timelineLastRef,
    savedLastRef,
    timelineSentinelRef,
    savedSentinelRef
  ]);

  // Update timeline post callback
  const updateTimelinePost = useCallback((updatedPost: IPost) => {
    dispatch({ type: 'UPDATE_TIMELINE_POST', payload: updatedPost });
  }, []);

  // Show loading skeletons for initial load
  if (currentData.isLoading && currentData.posts.length === 0) {
    return (
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
          {renderTabButtons()}
          <SortSelector
            options={COMMON_SORT_OPTIONS.timeline}
            value={state.sortBy}
            onChange={handleSortChange}
            placeholder="Sort By"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <UserTimelineSkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="w-full pb-20">
      {/* Header with tabs and sort */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
        {renderTabButtons()}
        <SortSelector
          options={COMMON_SORT_OPTIONS.timeline}
          value={state.sortBy}
          onChange={handleSortChange}
          placeholder="Sort By"
        />
      </div>

      {/* Content */}
      <div className="w-full">
        {currentData.posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentData.posts.map((post, index) => {
                const isLast = index === currentData.posts.length - 1;
                return (
                  <div
                    key={post._id}
                    ref={isLast ? currentData.lastElementRef : null}
                  >
                    <UserTimelineCard
                      post={post}
                      setTimelinePosts={updateTimelinePost}
                    />
                  </div>
                );
              })}
            </div>

            {/* Loading indicator and sentinel */}
            {currentData.isFetching && (
              <div className="flex justify-center py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <UserTimelineSkeletonCard key={`loading-${index}`} />
                  ))}
                </div>
              </div>
            )}

            {/* Sentinel for infinite scroll */}
            <div 
              ref={currentData.sentinelRef}
              className="h-1 w-full"
              aria-hidden="true"
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">
              {activeTab === "myTimeline" ? "No timeline posts yet" : "No saved posts yet"}
            </h3>
            <p className="text-center max-w-md">
              {activeTab === "myTimeline" 
                ? "Start sharing your travel experiences and moments!"
                : "Save interesting posts to view them here."
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OptimizedUserTimeline;