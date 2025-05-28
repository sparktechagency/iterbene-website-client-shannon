import CreateEvent from "./CreateEvent/CreateEvent";
import InterestedEvents from "./interested-events/interested-events";
import InvitedEvents from "./invited-events/invited-events";
import MyEvents from "./myEvents/my-events";
import SuggestionEvent from "./SuggestionEvent/SuggestionEvent";

const Events = () => {
  return (
    <>
      <CreateEvent />
      <MyEvents />
      <InvitedEvents />
      <InterestedEvents />
      <SuggestionEvent />
    </>
  );
};

export default Events;
