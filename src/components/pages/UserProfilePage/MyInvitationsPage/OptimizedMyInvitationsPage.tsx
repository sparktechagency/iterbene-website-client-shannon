"use client";
import React, { useMemo, useCallback, useReducer } from "react";
import {
  useGetMyInterestedEventsQuery,
  useGetMyInvitesQuery,
} from "@/redux/features/event/eventApi";
import MyUpComingTours from "./MyUpComingTours/MyUpComingTours";
import MyInvitationsEvent from "./MyInvitationsEvent/MyInvitationsEvent";
import { IEvent, IEventInvitation } from "@/types/event.types";
import { useUnifiedTabs } from "@/hooks/useUnifiedTabs";
import SortSelector, { COMMON_SORT_OPTIONS } from "@/components/common/SortSelector";

interface InvitationState {
  interestedEvents: IEvent[];
  eventInvitations: IEventInvitation[];
  upcomingPage: number;
  invitationPage: number;
  hasMoreUpcoming: boolean;
  hasMoreInvitations: boolean;
  upcomingDataLoaded: boolean;
  invitationDataLoaded: boolean;
  upcomingSortBy: string;
  invitationSortBy: string;
}

// Reducer for state management
type InvitationAction = 
  | { type: 'SET_INTERESTED_EVENTS'; payload: IEvent[] }
  | { type: 'SET_EVENT_INVITATIONS'; payload: IEventInvitation[] }
  | { type: 'SET_UPCOMING_PAGE'; payload: number }
  | { type: 'SET_INVITATION_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE_UPCOMING'; payload: boolean }
  | { type: 'SET_HAS_MORE_INVITATIONS'; payload: boolean }
  | { type: 'SET_UPCOMING_DATA_LOADED'; payload: boolean }
  | { type: 'SET_INVITATION_DATA_LOADED'; payload: boolean }
  | { type: 'SET_UPCOMING_SORT_BY'; payload: string }
  | { type: 'SET_INVITATION_SORT_BY'; payload: string }
  | { type: 'RESET_UPCOMING_FOR_SORT' }
  | { type: 'RESET_INVITATIONS_FOR_SORT' };

const invitationReducer = (state: InvitationState, action: InvitationAction): InvitationState => {
  switch (action.type) {
    case 'SET_INTERESTED_EVENTS':
      return { ...state, interestedEvents: action.payload };
    case 'SET_EVENT_INVITATIONS':
      return { ...state, eventInvitations: action.payload };
    case 'SET_UPCOMING_PAGE':
      return { ...state, upcomingPage: action.payload };
    case 'SET_INVITATION_PAGE':
      return { ...state, invitationPage: action.payload };
    case 'SET_HAS_MORE_UPCOMING':
      return { ...state, hasMoreUpcoming: action.payload };
    case 'SET_HAS_MORE_INVITATIONS':
      return { ...state, hasMoreInvitations: action.payload };
    case 'SET_UPCOMING_DATA_LOADED':
      return { ...state, upcomingDataLoaded: action.payload };
    case 'SET_INVITATION_DATA_LOADED':
      return { ...state, invitationDataLoaded: action.payload };
    case 'SET_UPCOMING_SORT_BY':
      return { ...state, upcomingSortBy: action.payload };
    case 'SET_INVITATION_SORT_BY':
      return { ...state, invitationSortBy: action.payload };
    case 'RESET_UPCOMING_FOR_SORT':
      return {
        ...state,
        interestedEvents: [],
        upcomingPage: 1,
        hasMoreUpcoming: true,
        upcomingDataLoaded: false
      };
    case 'RESET_INVITATIONS_FOR_SORT':
      return {
        ...state,
        eventInvitations: [],
        invitationPage: 1,
        hasMoreInvitations: true,
        invitationDataLoaded: false
      };
    default:
      return state;
  }
};

const initialState: InvitationState = {
  interestedEvents: [],
  eventInvitations: [],
  upcomingPage: 1,
  invitationPage: 1,
  hasMoreUpcoming: true,
  hasMoreInvitations: true,
  upcomingDataLoaded: false,
  invitationDataLoaded: false,
  upcomingSortBy: "createdAt",
  invitationSortBy: "createdAt"
};

const OptimizedMyInvitationsPage = () => {
  const [state, dispatch] = useReducer(invitationReducer, initialState);

  // Unified tab management
  const { activeTab, renderTabButtons } = useUnifiedTabs({
    tabs: [
      { key: "upcomingTour", label: "Upcoming Tours" },
      { key: "invitation", label: "Invitations" }
    ],
    defaultTab: "upcomingTour",
    onTabChange: () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Memoized API query parameters
  const upcomingQueryParams = useMemo(() => [
    { key: "page", value: state.upcomingPage.toString() },
    { key: "limit", value: "9" },
    { key: "sortBy", value: state.upcomingSortBy },
  ], [state.upcomingPage, state.upcomingSortBy]);

  const invitationQueryParams = useMemo(() => [
    { key: "page", value: state.invitationPage.toString() },
    { key: "limit", value: "9" },
    { key: "sortBy", value: state.invitationSortBy },
  ], [state.invitationPage, state.invitationSortBy]);

  // API Queries
  const {
    isLoading: isUpcomingLoading,
    isFetching: isUpcomingFetching,
  } = useGetMyInterestedEventsQuery(
    upcomingQueryParams,
    {
      refetchOnMountOrArgChange: true,
      skip: activeTab !== "upcomingTour"
    }
  );

  const {
    isLoading: isInvitationLoading,
    isFetching: isInvitationFetching,
  } = useGetMyInvitesQuery(
    invitationQueryParams,
    {
      refetchOnMountOrArgChange: true,
      skip: activeTab !== "invitation"
    }
  );

  // Sort change handlers
  const handleUpcomingSortChange = useCallback((value: string) => {
    dispatch({ type: 'SET_UPCOMING_SORT_BY', payload: value });
    dispatch({ type: 'RESET_UPCOMING_FOR_SORT' });
  }, []);

  const handleInvitationSortChange = useCallback((value: string) => {
    dispatch({ type: 'SET_INVITATION_SORT_BY', payload: value });
    dispatch({ type: 'RESET_INVITATIONS_FOR_SORT' });
  }, []);

  // Current sort value based on active tab
  const currentSortValue = activeTab === "upcomingTour" ? state.upcomingSortBy : state.invitationSortBy;
  
  // Sort change handler based on active tab
  const handleSortChange = useCallback((value: string) => {
    if (activeTab === "upcomingTour") {
      handleUpcomingSortChange(value);
    } else {
      handleInvitationSortChange(value);
    }
  }, [activeTab, handleUpcomingSortChange, handleInvitationSortChange]);

  // Memoized tab content to prevent unnecessary re-renders
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "upcomingTour":
        return (
          <MyUpComingTours
            interestedEvents={state.interestedEvents}
            setInterestedEvents={(events) => dispatch({ type: 'SET_INTERESTED_EVENTS', payload: events })}
            currentPage={state.upcomingPage}
            setCurrentPage={(page) => dispatch({ type: 'SET_UPCOMING_PAGE', payload: page })}
            hasMore={state.hasMoreUpcoming}
            setHasMore={(hasMore) => dispatch({ type: 'SET_HAS_MORE_UPCOMING', payload: hasMore })}
            dataLoaded={state.upcomingDataLoaded}
            setDataLoaded={(loaded) => dispatch({ type: 'SET_UPCOMING_DATA_LOADED', payload: loaded })}
            isLoading={isUpcomingLoading || isUpcomingFetching}
          />
        );
      case "invitation":
        return (
          <MyInvitationsEvent
            eventInvitations={state.eventInvitations}
            setEventInvitations={(invitations) => dispatch({ type: 'SET_EVENT_INVITATIONS', payload: invitations })}
            currentPage={state.invitationPage}
            setCurrentPage={(page) => dispatch({ type: 'SET_INVITATION_PAGE', payload: page })}
            hasMore={state.hasMoreInvitations}
            setHasMore={(hasMore) => dispatch({ type: 'SET_HAS_MORE_INVITATIONS', payload: hasMore })}
            dataLoaded={state.invitationDataLoaded}
            setDataLoaded={(loaded) => dispatch({ type: 'SET_INVITATION_DATA_LOADED', payload: loaded })}
            isLoading={isInvitationLoading || isInvitationFetching}
          />
        );
      default:
        return null;
    }
  }, [
    activeTab,
    state,
    isUpcomingLoading,
    isUpcomingFetching,
    isInvitationLoading,
    isInvitationFetching
  ]);

  return (
    <section className="w-full pb-20">
      {/* Header with tabs and sort selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-5">
        {renderTabButtons()}
        <SortSelector
          options={COMMON_SORT_OPTIONS.invitations}
          value={currentSortValue}
          onChange={handleSortChange}
          placeholder="Sort By"
        />
      </div>

      {/* Content */}
      <div className="w-full">
        {tabContent}
      </div>
    </section>
  );
};

export default OptimizedMyInvitationsPage;