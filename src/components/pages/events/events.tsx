import CreateEvent from "./CreateEvent/CreateEvent";
import InterestedEvents from "./interested-events/interested-events";
import InvitedEvents from "./invited-events/invited-events";
import MyEvents from "./myEvents/my-events";
import SuggestionEvent from "./SuggestionEvent/SuggestionEvent";

const Events = () => {
  return (
   <section className="w-full pb-10 space-y-8">
      <CreateEvent />
      <MyEvents />
       <hr className="border-t border-gray-400" />
      <InvitedEvents />
       <hr className="border-t border-gray-400" />
      <InterestedEvents />
       <hr className="border-t border-gray-400" />
      <SuggestionEvent />
    </section>
  );
};

export default Events;
