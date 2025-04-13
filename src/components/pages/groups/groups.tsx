import React from "react";
import MyGroups from "./my-groups/my-groups";
import InvitedGroups from "./invited-groups/invited-groups";
import JoinedGroups from "./joined-groups/joined-groups";
import CreateGroup from "./create-group/create-group";

const Groups = () => {
  return (
    <>
      <CreateGroup />
      <MyGroups />
      <InvitedGroups />
      <JoinedGroups />
    </>
  );
};

export default Groups;
