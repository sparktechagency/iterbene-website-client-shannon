import React from "react";
import GroupSummary from "./GroupSummary";
import GroupLocationMap from "./GroupLocationMap";
import GroupAuthorDetails from "./GroupAuthorDetails";
import GroupParticipantsList from "./GroupParticipantsList";

const GroupAbout = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-5">
      <GroupSummary />
      <GroupLocationMap />
      <GroupAuthorDetails />
      <GroupParticipantsList />
    </div>
  );
};

export default GroupAbout;
