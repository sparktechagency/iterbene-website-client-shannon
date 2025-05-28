"use client";

import { useGetMyInterestedEventsQuery } from "@/redux/features/event/eventApi";
import { IEvent } from "@/types/event.types";
import MyUpComingTourCard from "./MyUpComingTourCard";

const MyUpComingTours = () => {
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
          <MyUpComingTourCard key={event._id} event={event} />
        ))}
      </div>
    );
  }
  return <section>{content}</section>;
};

export default MyUpComingTours;
