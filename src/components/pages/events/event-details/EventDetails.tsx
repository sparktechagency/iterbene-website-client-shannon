'use client';
import { useGetEventQuery } from "@/redux/features/event/eventApi";
import EventDetailsHeader from "./EventDetailsHeader/EventDetailsHeader";
import EventDetailsTab from "./EventDetailsTab";
import { useParams } from "next/navigation";

const EventDetails = () => {
  const { eventId } = useParams();
  const { data: responseData } = useGetEventQuery(eventId, {
    refetchOnMountOrArgChange: true,
    skip: !eventId,
  });
  const eventDetailsData = responseData?.data?.attributes;
  console.log("Event Details Data:", eventDetailsData);
  return (
    <>
      <EventDetailsHeader eventDetailsData={eventDetailsData} />
      <EventDetailsTab eventDetailsData={eventDetailsData} />
    </>
  );
};

export default EventDetails;
