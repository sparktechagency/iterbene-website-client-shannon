'use client';
import InvitedGroupCard from "./invited-group-card";
import { useGetMyInvitedGroupsQuery } from "@/redux/features/group/groupApi";
import {IGroupInvite } from "@/types/group.types";
import MyGroupCardSkeleton from "../my-groups/MyGroupCardSkeleton";
const InvitedGroups = () => {
  const { data: responseData, isLoading } =
    useGetMyInvitedGroupsQuery(undefined);
  const groupsData = responseData?.data?.attributes?.results;
  let content = null;
  if (!isLoading) {
    content = <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <MyGroupCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
  }else if (groupsData?.length === 0) {
    content = <p className="text-xl">No invited groups found</p>;
  } else if (groupsData?.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        {groupsData?.map((group: IGroupInvite) => (
          <InvitedGroupCard key={group?._id} group={group} />
        ))}
      </div>
    );
  }

  return (
    <section>
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Your Groups Awaits{" "}
        </h1>
      </div>

      {/* Content Section */}
      {content}
    </section>
  );
};

export default InvitedGroups;
