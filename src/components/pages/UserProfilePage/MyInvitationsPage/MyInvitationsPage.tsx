"use client";
import { useState, useEffect } from "react";
import {
  useGetMyInterestedEventsQuery,
  useGetMyInvitesQuery,
} from "@/redux/features/event/eventApi";
import MyUpComingTours from "./MyUpComingTours/MyUpComingTours";
import MyInvitationsEvent from "./MyInvitationsEvent/MyInvitationsEvent";
import { IEvent, IEventInvitation } from "@/types/event.types";
import SelectField from "@/components/custom/SelectField";

const MyInvitationsPage = () => {
  const [activeTab, setActiveTab] = useState<"upcomingTour" | "invitation">(
    "upcomingTour"
  );
  // Separate sortBy states for each tab
  const [upcomingSortBy, setUpcomingSortBy] = useState<string>("createdAt");
  const [invitationSortBy, setInvitationSortBy] = useState<string>("createdAt");

  // Data states
  const [interestedEvents, setInterestedEvents] = useState<IEvent[]>([]);
  const [eventInvitations, setEventInvitations] = useState<IEventInvitation[]>(
    []
  );

  // Pagination states
  const [upcomingPage, setUpcomingPage] = useState<number>(1);
  const [invitationPage, setInvitationPage] = useState<number>(1);
  const [hasMoreUpcoming, setHasMoreUpcoming] = useState<boolean>(true);
  const [hasMoreInvitations, setHasMoreInvitations] = useState<boolean>(true);

  // Loading flags
  const [upcomingDataLoaded, setUpcomingDataLoaded] = useState<boolean>(false);
  const [invitationDataLoaded, setInvitationDataLoaded] =
    useState<boolean>(false);

  // API query parameters
  const upcomingQueryParams = [
    { key: "page", value: upcomingPage.toString() },
    { key: "limit", value: "9" },
    { key: "sortBy", value: upcomingSortBy },
  ];

  const invitationQueryParams = [
    { key: "page", value: invitationPage.toString() },
    { key: "limit", value: "9" },
    { key: "sortBy", value: invitationSortBy },
  ];

  const {
    data: upcomingData,
    isLoading: upcomingLoading,
    refetch: refetchUpcoming,
  } = useGetMyInterestedEventsQuery(upcomingQueryParams, {
    skip: activeTab !== "upcomingTour",
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: invitationData,
    isLoading: invitationLoading,
    refetch: refetchInvitations,
  } = useGetMyInvitesQuery(invitationQueryParams, {
    skip: activeTab !== "invitation",
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Handle upcoming events data
  useEffect(() => {
    const events = upcomingData?.data?.attributes?.results || [];
    if (events?.length > 0) {
      setInterestedEvents((prev) => {
        const existingIds = new Set(prev.map((event) => event._id));
        const newEvents = events.filter(
          (event: IEvent) => !existingIds.has(event._id)
        );

        if (upcomingPage === 1) {
          setUpcomingDataLoaded(true);
          return events;
        } else {
          return [...prev, ...newEvents];
        }
      });
      setHasMoreUpcoming(
        upcomingPage < (upcomingData?.data?.attributes?.totalPages || 0)
      );
    } else if (upcomingPage === 1 && !upcomingDataLoaded) {
      setUpcomingDataLoaded(true);
      setInterestedEvents([]);
    }
  }, [upcomingData, upcomingPage, upcomingDataLoaded]);

  // Handle invitation events data
  useEffect(() => {
    const events = invitationData?.data?.attributes?.results || [];
    if (events?.length > 0) {
      setEventInvitations((prev) => {
        const existingIds = new Set(prev.map((event) => event._id));
        const newEvents = events.filter(
          (event: IEventInvitation) => !existingIds.has(event._id)
        );

        if (invitationPage === 1) {
          setInvitationDataLoaded(true);
          return events;
        } else {
          return [...prev, ...newEvents];
        }
      });
      setHasMoreInvitations(
        invitationPage < (invitationData?.data?.attributes?.totalPages || 0)
      );
    } else if (invitationPage === 1 && !invitationDataLoaded) {
      setInvitationDataLoaded(true);
      setEventInvitations([]);
    }
  }, [invitationData, invitationPage, invitationDataLoaded]);

  // Handle real-time updates for upcoming events
  useEffect(() => {
    if (
      upcomingData?.data?.attributes?.results &&
      interestedEvents.length > 0
    ) {
      setInterestedEvents((prev) => {
        const updatedEvents = upcomingData.data.attributes.results as IEvent[];
        const existingIds = new Set(updatedEvents.map((event) => event._id));
        return prev
          .filter((event) => existingIds.has(event._id))
          .map((existingEvent) => {
            const updatedEvent = updatedEvents.find(
              (e) => e._id === existingEvent._id
            );
            return updatedEvent || existingEvent;
          });
      });
    }
  }, [upcomingData, interestedEvents.length]);

  // Handle real-time updates for invitations
  useEffect(() => {
    if (
      invitationData?.data?.attributes?.results &&
      eventInvitations.length > 0
    ) {
      setEventInvitations((prev) => {
        const updatedInvitations = invitationData.data.attributes
          .results as IEventInvitation[];
        const existingIds = new Set(updatedInvitations.map((inv) => inv._id));
        return prev
          .filter((inv) => existingIds.has(inv._id))
          .map((existingInvitation) => {
            const updatedInvitation = updatedInvitations.find(
              (e) => e._id === existingInvitation._id
            );
            return updatedInvitation || existingInvitation;
          });
      });
    }
  }, [invitationData, eventInvitations.length]);

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    if (activeTab === "upcomingTour") {
      setUpcomingSortBy(sortValue);
      refetchUpcoming();
    } else {
      setInvitationSortBy(sortValue);
      refetchInvitations();
    }
  };

  // Handle tab change
  const handleTabChange = (tab: "upcomingTour" | "invitation") => {
    setActiveTab(tab);
    if (tab === "upcomingTour" && !upcomingDataLoaded) {
      refetchUpcoming();
    } else if (tab === "invitation" && !invitationDataLoaded) {
      refetchInvitations();
    }
  };

  return (
    <section className="w-full pb-20">
      {/* Tabs and Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex space-x-4">
            <button
              onClick={() => handleTabChange("upcomingTour")}
              className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeTab === "upcomingTour" &&
                "bg-[#E9F8F9] border border-primary text-primary"
              }`}
            >
              Upcoming Tour
            </button>
            <button
              onClick={() => handleTabChange("invitation")}
              className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeTab === "invitation" &&
                "bg-[#E9F8F9] border border-primary text-primary"
              }`}
            >
              Invitations
            </button>
          </div>
        </div>

        <div className="w-full max-w-40">
          <SelectField
            items={[
              { label: "Recently", value: "createdAt" },
              { label: "Name (A-Z)", value: "nameAsc" },
              { label: "Name (Z-A)", value: "nameDesc" },
              { label: "Oldest First", value: "-createdAt" },
            ]}
            name="sortBy"
            fullWidth
            placeholder="Sort By"
            value={
              activeTab === "upcomingTour" ? upcomingSortBy : invitationSortBy
            }
            onChange={(e) => handleSortChange(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        <div className={activeTab === "upcomingTour" ? "block" : "hidden"}>
          <MyUpComingTours
            interestedEvents={interestedEvents}
            setInterestedEvents={setInterestedEvents}
            currentPage={upcomingPage}
            setCurrentPage={setUpcomingPage}
            hasMore={hasMoreUpcoming}
            setHasMore={setHasMoreUpcoming}
            dataLoaded={upcomingDataLoaded}
            setDataLoaded={setUpcomingDataLoaded}
            isLoading={upcomingLoading}
          />
        </div>
        <div className={activeTab === "invitation" ? "block" : "hidden"}>
          <MyInvitationsEvent
            eventInvitations={eventInvitations}
            setEventInvitations={setEventInvitations}
            currentPage={invitationPage}
            setCurrentPage={setInvitationPage}
            hasMore={hasMoreInvitations}
            setHasMore={setHasMoreInvitations}
            dataLoaded={invitationDataLoaded}
            setDataLoaded={setInvitationDataLoaded}
            isLoading={invitationLoading}
          />
        </div>
      </div>
    </section>
  );
};

export default MyInvitationsPage;
