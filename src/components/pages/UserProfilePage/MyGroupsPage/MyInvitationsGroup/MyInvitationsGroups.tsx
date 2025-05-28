"use client";

import { useGetMyInvitedGroupsQuery } from "@/redux/features/group/groupApi";
import { IGroupInvite } from "@/types/group.types";
import MyInvitationsGroupCard from "./MyInvitationsGroupCard";

const MyInvitationsGroups = () => {
  const { data: responseData, isLoading } =
    useGetMyInvitedGroupsQuery(undefined);
  const groupsData = responseData?.data?.attributes?.results;
  let content = null;
  if (isLoading) {
    content = <p>Loading...</p>;
  }
  if (groupsData?.length === 0) {
    content = <p className="text-xl">No invited groups found</p>;
  } else if (groupsData?.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groupsData?.map((group: IGroupInvite) => (
          <MyInvitationsGroupCard key={group?._id} group={group} />
        ))}
      </div>
    );
  }
  return <div>{content}</div>;
};

export default MyInvitationsGroups;
