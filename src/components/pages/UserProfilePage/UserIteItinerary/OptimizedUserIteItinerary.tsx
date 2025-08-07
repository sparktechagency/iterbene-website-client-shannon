"use client";
import React, { useEffect, useMemo, useCallback, useReducer } from "react";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useGetSavedPostQuery } from "@/redux/features/savedPost/savedPost.api";
import { IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import UserIteItineraryCard from "./UserIteItineraryCard";
import UserTimelineSkeletonCard from "../UserTimeline/UserTimelineSkeletonCard";
import { useUnifiedTabs } from "@/hooks/useUnifiedTabs";
import { useOptimizedInfiniteScroll } from "@/hooks/useOptimizedInfiniteScroll";
import SortSelector, { COMMON_SORT_OPTIONS } from "@/components/common/SortSelector";

interface ItineraryState {
  itineraryPosts: IPost[];
  savedItineraryPosts: IPost[];
  removePostIds: string[];
  currentPage: number;
  savedCurrentPage: number;
  hasMore: boolean;
  savedHasMore: boolean;
  sortBy: string;
}

// Reducer for state management
type ItineraryAction = 
  | { type: 'SET_ITINERARY_POSTS'; payload: IPost[] }
  | { type: 'APPEND_ITINERARY_POSTS'; payload: IPost[] }
  | { type: 'SET_SAVED_ITINERARY_POSTS'; payload: IPost[] }
  | { type: 'APPEND_SAVED_ITINERARY_POSTS'; payload: IPost[] }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_SAVED_CURRENT_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'SET_SAVED_HAS_MORE'; payload: boolean }
  | { type: 'SET_SORT_BY'; payload: string }
  | { type: 'ADD_REMOVE_POST_ID'; payload: string }
  | { type: 'REMOVE_POST_FROM_LIST'; payload: string }
  | { type: 'RESET_FOR_NEW_SORT' }
  | { type: 'UPDATE_ITINERARY_POST'; payload: IPost };

const itineraryReducer = (state: ItineraryState, action: ItineraryAction): ItineraryState => {
  switch (action.type) {
    case 'SET_ITINERARY_POSTS':
      return { ...state, itineraryPosts: action.payload };
    case 'APPEND_ITINERARY_POSTS': {
      const existingIds = new Set([...state.itineraryPosts.map(post => post._id), ...state.removePostIds]);
      const newPosts = action.payload.filter(post => !existingIds.has(post._id));
      return { ...state, itineraryPosts: [...state.itineraryPosts, ...newPosts] };
    }
    case 'SET_SAVED_ITINERARY_POSTS':
      return { ...state, savedItineraryPosts: action.payload };
    case 'APPEND_SAVED_ITINERARY_POSTS': {
      const existingIds = new Set(state.savedItineraryPosts.map(post => post._id));
      const newPosts = action.payload.filter(post => !existingIds.has(post._id));
      return { ...state, savedItineraryPosts: [...state.savedItineraryPosts, ...newPosts] };
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
    case 'ADD_REMOVE_POST_ID':
      return { ...state, removePostIds: [...state.removePostIds, action.payload] };
    case 'REMOVE_POST_FROM_LIST':
      return {
        ...state,
        itineraryPosts: state.itineraryPosts.filter(post => post._id !== action.payload),
        savedItineraryPosts: state.savedItineraryPosts.filter(post => post._id !== action.payload)
      };
    case 'RESET_FOR_NEW_SORT':
      return {
        ...state,
        itineraryPosts: [],
        savedItineraryPosts: [],
        removePostIds: [],
        currentPage: 1,
        savedCurrentPage: 1,
        hasMore: true,
        savedHasMore: true
      };
    case 'UPDATE_ITINERARY_POST':
      return {
        ...state,
        itineraryPosts: state.itineraryPosts.map(post => 
          post._id === action.payload._id ? action.payload : post
        ),
        savedItineraryPosts: state.savedItineraryPosts.map(post => 
          post._id === action.payload._id ? action.payload : post
        )
      };
    default:
      return state;
  }
};

const initialState: ItineraryState = {
  itineraryPosts: [],
  savedItineraryPosts: [],
  removePostIds: [],
  currentPage: 1,
  savedCurrentPage: 1,
  hasMore: true,
  savedHasMore: true,
  sortBy: "createdAt"
};

const OptimizedUserIteItinerary = () => {
  const [state, dispatch] = useReducer(itineraryReducer, initialState);
  const { userName } = useParams();
  
  const username = typeof userName === "string" ? userName : 
                   Array.isArray(userName) ? userName[0] : "";

  // Unified tab management
  const { activeTab, renderTabButtons } = useUnifiedTabs({
    tabs: [
      { key: "myItinerary", label: "My Itinerary" },
      { key: "savedItinerary", label: "Saved Itinerary" }
    ],
    defaultTab: "myItinerary",
    onTabChange: () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // My itinerary posts query with type filtering
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
        { key: "type", value: "itinerary" }, // Filter for itinerary posts only
      ],
    },
    { 
      refetchOnMountOrArgChange: true, 
      skip: !username || activeTab !== "myItinerary" 
    }
  );

  // Saved itinerary posts query
  const {
    data: savedResponseData,
    isLoading: isSavedLoading,
    isFetching: isSavedFetching,
  } = useGetSavedPostQuery(
    [
      { key: "page", value: state.savedCurrentPage.toString() },
      { key: "limit", value: "9" },
      { key: "sortBy", value: state.sortBy },
      { key: "type", value: "itinerary" }, // Filter for itinerary posts only
    ],
    { 
      refetchOnMountOrArgChange: true, 
      skip: activeTab !== "savedItinerary" 
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

  // Handle itinerary posts data
  useEffect(() => {
    if (currentPagePosts.length > 0) {
      if (state.currentPage === 1) {
        dispatch({ type: 'SET_ITINERARY_POSTS', payload: currentPagePosts });
      } else {
        dispatch({ type: 'APPEND_ITINERARY_POSTS', payload: currentPagePosts });
      }
    }
  }, [currentPagePosts, state.currentPage]);

  // Handle saved itinerary posts data
  useEffect(() => {
    if (currentPageSavedPosts.length > 0) {
      if (state.savedCurrentPage === 1) {
        dispatch({ type: 'SET_SAVED_ITINERARY_POSTS', payload: currentPageSavedPosts });
      } else {
        dispatch({ type: 'APPEND_SAVED_ITINERARY_POSTS', payload: currentPageSavedPosts });
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

  // Load more callbacks for infinite scroll
  const loadMoreItinerary = useCallback(() => {
    if (!isLoading && !isFetching && state.hasMore) {
      dispatch({ type: 'SET_CURRENT_PAGE', payload: state.currentPage + 1 });
    }
  }, [isLoading, isFetching, state.hasMore, state.currentPage]);

  const loadMoreSaved = useCallback(() => {
    if (!isSavedLoading && !isSavedFetching && state.savedHasMore) {
      dispatch({ type: 'SET_SAVED_CURRENT_PAGE', payload: state.savedCurrentPage + 1 });
    }
  }, [isSavedLoading, isSavedFetching, state.savedHasMore, state.savedCurrentPage]);

  // Infinite scroll hooks
  const { lastElementRef: itineraryLastRef, sentinelRef: itinerarySentinelRef } = useOptimizedInfiniteScroll({
    isLoading,
    isFetching,
    hasMore: state.hasMore,
    onLoadMore: loadMoreItinerary,
    enabled: activeTab === "myItinerary"
  });

  const { lastElementRef: savedLastRef, sentinelRef: savedSentinelRef } = useOptimizedInfiniteScroll({
    isLoading: isSavedLoading,
    isFetching: isSavedFetching,
    hasMore: state.savedHasMore,
    onLoadMore: loadMoreSaved,
    enabled: activeTab === "savedItinerary"
  });

  // Current data based on active tab
  const currentData = useMemo(() => ({
    posts: activeTab === "myItinerary" ? state.itineraryPosts : state.savedItineraryPosts,
    isLoading: activeTab === "myItinerary" ? isLoading : isSavedLoading,
    isFetching: activeTab === "myItinerary" ? isFetching : isSavedFetching,
    hasMore: activeTab === "myItinerary" ? state.hasMore : state.savedHasMore,
    lastElementRef: activeTab === "myItinerary" ? itineraryLastRef : savedLastRef,
    sentinelRef: activeTab === "myItinerary" ? itinerarySentinelRef : savedSentinelRef
  }), [
    activeTab,
    state.itineraryPosts,
    state.savedItineraryPosts,
    isLoading,
    isSavedLoading,
    isFetching,
    isSavedFetching,
    state.hasMore,
    state.savedHasMore,
    itineraryLastRef,
    savedLastRef,
    itinerarySentinelRef,
    savedSentinelRef
  ]);

  // Post management callbacks
  const updateItineraryPosts = useCallback((updatedPost: IPost) => {
    dispatch({ type: 'UPDATE_ITINERARY_POST', payload: updatedPost });
  }, []);

  const removeItineraryPost = useCallback((postId: string) => {
    dispatch({ type: 'ADD_REMOVE_POST_ID', payload: postId });
    dispatch({ type: 'REMOVE_POST_FROM_LIST', payload: postId });
  }, []);

  // Show loading skeletons for initial load
  if (currentData.isLoading && currentData.posts.length === 0) {
    return (
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
          {renderTabButtons()}
          <SortSelector
            options={COMMON_SORT_OPTIONS.itinerary}
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
          options={COMMON_SORT_OPTIONS.itinerary}
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
                    <UserIteItineraryCard
                      post={post}
                      setItineraryPosts={updateItineraryPosts}
                      setRemovePostIds={removeItineraryPost}
                    />
                  </div>
                );
              })}
            </div>

            {/* Loading indicator */}
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
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold mb-2">
              {activeTab === "myItinerary" ? "No itineraries yet" : "No saved itineraries yet"}
            </h3>
            <p className="text-center max-w-md">
              {activeTab === "myItinerary" 
                ? "Start creating and sharing your travel itineraries!"
                : "Save interesting itineraries to view them here."
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OptimizedUserIteItinerary;