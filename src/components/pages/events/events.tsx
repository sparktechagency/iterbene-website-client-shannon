import React from "react";
import InvitedEvents from "./invited-events/invited-events";
import UpcomingEvents from "./upComingEvents/upComing-events";
import CreateEvent from "./CreateEvent/CreateEvent";
import InterestedEvents from "./interested-events/interested-events";
import SuggestionEvent from "./SuggestionEvent/SuggestionEvent";

const Events = () => {
  return (
    <>
      <CreateEvent />
      <UpcomingEvents />
      <InvitedEvents />
      <InterestedEvents />
      <SuggestionEvent />
    </>
  );
};

export default Events;
