import { IEventDetails } from "@/types/event.types";
import EventAuthorDetails from "./EventAuthorDetails";
import EventLocationMap from "./EventLocationMap";
import EventSummary from "./EventSummary";
import EventParticipantsList from "./EventParticipantsList";

const EventAbout = ({
  eventDetailsData,
}: {
  eventDetailsData: IEventDetails;
}) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
      <EventSummary eventDetailsData={eventDetailsData} />
      <EventLocationMap eventDetailsData={eventDetailsData} />
      <EventAuthorDetails eventDetailsData={eventDetailsData} />
      <EventParticipantsList eventDetailsData={eventDetailsData} />
    </div>
  );
};

export default EventAbout;
