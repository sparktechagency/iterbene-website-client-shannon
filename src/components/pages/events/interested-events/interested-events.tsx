"use client";
import { useGetMyInterestedEventsQuery } from "@/redux/features/event/eventApi";
import { IEvent } from "@/types/event.types";
import InterestedEventCard from "./interested-events-card";
const InterestedEvents = () => {
  const { data: responseData, isLoading } =
    useGetMyInterestedEventsQuery(undefined);
  const interestedEvent = responseData?.data?.attributes?.results;
  let content = null;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (interestedEvent?.length === 0) {
    content = <p className="text-xl">No events found</p>;
  } else if (interestedEvent?.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {interestedEvent?.map((event: IEvent) => (
          <InterestedEventCard key={event._id} event={event} />
        ))}
      </div>
    );
  }
  return (
    <section className="w-full pt-5 pb-7 border-[#9EA1B3] border-b">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Interested Events
        </h1>
        <button className="text-primary hover:underline">Show more</button>
      </div>
      {/* Content Section */}
      {content}
    </section>
  );
};

export default InterestedEvents;
