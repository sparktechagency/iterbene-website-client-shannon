"use client";
import { useGetMyInvitesQuery } from "@/redux/features/event/eventApi";
import InvitedEventCard from "@/components/pages/events/invited-events/invited-event-card";
import { IEventInvitation } from "@/types/event.types";
const MyInvitations = () => {
  const { data: responseData, isLoading } = useGetMyInvitesQuery(undefined);
  const upComingEvent = responseData?.data?.attributes?.results;
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
  return <section className="w-full ">{content}</section>;
};

export default MyInvitations;
