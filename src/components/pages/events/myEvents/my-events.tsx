"use client";
import { useGetMyEventsQuery } from "@/redux/features/event/eventApi";
import { IEvent } from "@/types/event.types";
import MyEventCard from "./my-event-card";
const MyEvents = () => {
  const { data: responseData, isLoading } = useGetMyEventsQuery(undefined);
  const upComingEvent = responseData?.data?.attributes?.results;
  let content = null;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (upComingEvent?.length === 0) {
    content = <p className="text-xl">No events found</p>;
  } else if (upComingEvent?.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {upComingEvent?.map((event: IEvent) => (
          <MyEventCard key={event._id} event={event} />
        ))}
      </div>
    );
  }
  return (
    <section className="w-full pt-2 pb-7 border-[#9EA1B3] border-b">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          My Upcoming Events
        </h1>
      </div>
      {/* Content Section */}
      {content}
    </section>
  );
};

export default MyEvents;
