"use client";
import { useGetEventQuery } from "@/redux/features/event/eventApi";
import EventDetailsHeader from "./EventDetailsHeader/EventDetailsHeader";
import EventDetailsTab from "./EventDetailsTab";
import { useParams } from "next/navigation";
import { useClientOnly } from "@/hooks/useClientOnly";
import { Suspense } from "react";
import EventDetailsHeaderSkeleton from "./EventDetailsHeader/EventDetailsHeaderSkeleton";
import { EventDetailsTabSkeleton } from "./EventDetailsTabSkeleton";

const EventDetailsContent = () => {
  const { eventId } = useParams();
  const { data: responseData, isLoading } = useGetEventQuery(eventId, {
    refetchOnMountOrArgChange: true,
    skip: !eventId,
  });
  const eventDetailsData = responseData?.data?.attributes;

  return (
    <>
      {isLoading ? (
        <EventDetailsHeaderSkeleton />
      ) : (
        <EventDetailsHeader eventDetailsData={eventDetailsData} />
      )}
      {isLoading ? (
        <EventDetailsTabSkeleton />
      ) : (
        <EventDetailsTab eventDetailsData={eventDetailsData} />
      )}
    </>
  );
};

const EventDetails = () => {
  const isClient = useClientOnly();

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <EventDetailsContent />
    </Suspense>
  );
};

export default EventDetails;
