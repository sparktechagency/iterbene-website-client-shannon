"use client";
import { useState } from "react";
import MyUpComingTours from "./MyUpComingTours/MyUpComingTours";
import MyInvitationsEvent from "./MyInvitationsEvent/MyInvitationsEvent";
import { IEvent, IEventInvitation } from "@/types/event.types";

const MyInvitationsPage = () => {
  const [activeTab, setActiveTab] = useState<"upcomingTour" | "invitation">(
    "upcomingTour"
  );
  const [interestedEvents, setInterestedEvents] = useState<IEvent[]>([]);
  const [eventInvitations, setEventInvitations] = useState<IEventInvitation[]>(
    []
  );
  const [upcomingPage, setUpcomingPage] = useState<number>(1);
  const [invitationPage, setInvitationPage] = useState<number>(1);
  const [hasMoreUpcoming, setHasMoreUpcoming] = useState<boolean>(true);
  const [hasMoreInvitations, setHasMoreInvitations] = useState<boolean>(true);

  return (
    <section className="w-full pb-20">
      {/* Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("upcomingTour")}
            className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === "upcomingTour" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            Upcoming Tour
          </button>
          <button
            onClick={() => setActiveTab("invitation")}
            className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === "invitation" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            Invitations
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        {activeTab === "upcomingTour" ? (
          <MyUpComingTours
            interestedEvents={interestedEvents}
            setInterestedEvents={setInterestedEvents}
            currentPage={upcomingPage}
            setCurrentPage={setUpcomingPage}
            hasMore={hasMoreUpcoming}
            setHasMore={setHasMoreUpcoming}
          />
        ) : (
          <MyInvitationsEvent
            eventInvitations={eventInvitations}
            setEventInvitations={setEventInvitations}
            currentPage={invitationPage}
            setCurrentPage={setInvitationPage}
            hasMore={hasMoreInvitations}
            setHasMore={setHasMoreInvitations}
          />
        )}
      </div>
    </section>
  );
};

export default MyInvitationsPage;
