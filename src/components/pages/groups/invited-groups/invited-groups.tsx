'use client';
import InvitedGroupCard from "./invited-group-card";
import { useGetMyInvitedGroupsQuery } from "@/redux/features/group/groupApi";
import {IGroupInvite } from "@/types/group.types";
const InvitedGroups = () => {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {groupsData?.map((group: IGroupInvite) => (
          <InvitedGroupCard key={group?._id} group={group} />
        ))}
      </div>
    );
  }
  console.log("Groups Data", groupsData);
  return (
    <section className="w-full pt-2 pb-7 mt-7 border-[#9EA1B3] border-b">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Your Groups Awaits{" "}
        </h1>
        <button className="text-primary hover:underline">Show more</button>
      </div>

      {/* Content Section */}
      {content}
    </section>
  );
};

export default InvitedGroups;
