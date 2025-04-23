
import EventAuthorDetails from "./EventAuthorDetails";
import EventLocationMap from "./EventLocationMap";
import GroupParticipantsList from "./EventParticipantsList";
import EventSummary from "./EventSummary";

const EventAbout = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
      <EventSummary />
      <EventLocationMap />
      <EventAuthorDetails />
      <GroupParticipantsList />
    </div>
  );
};

export default EventAbout;
