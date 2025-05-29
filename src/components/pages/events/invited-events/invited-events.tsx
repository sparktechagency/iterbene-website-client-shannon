"use client";
import { useGetMyInvitesQuery } from "@/redux/features/event/eventApi";
import { IEventInvitation } from "@/types/event.types";
import InvitedEventCard from "./invited-event-card";
const InvitedEvents = () => {
  const { data: responseData, isLoading } = useGetMyInvitesQuery(undefined);
  const upComingEvent = responseData?.data?.attributes?.results;
  const invitationCount = responseData?.data?.attributes?.invitationCount;
  let content = null;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (upComingEvent?.length === 0) {
    content = <p className="text-xl">No events found</p>;
  } else if (upComingEvent?.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {upComingEvent?.map((event: IEventInvitation) => (
          <InvitedEventCard key={event._id} event={event} />
        ))}
      </div>
    );
  }
  return (
    <section className="w-full pt-5 pb-7 border-[#9EA1B3] border-b">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Your Events Awaits
          </h1>
          <span className="bg-primary text-white size-6 rounded-full flex justify-center items-center">
            {invitationCount}
          </span>
        </div>
        <button className="text-primary hover:underline">Show more</button>
      </div>
      {/* Content Section */}
      {content}
    </section>
  );
};

export default InvitedEvents;
