'use client';
import JoinedGroupCard from "./joined-group-card";
import { useGetMyJoinedGroupsQuery } from "@/redux/features/group/groupApi";
import { IGroup } from "@/types/group.types";
const JoinedGroups = () => {
  const { data: responseData, isLoading } =
    useGetMyJoinedGroupsQuery(undefined);
  const groupsData = responseData?.data?.attributes?.results;
  let content = null;
  if (isLoading) {
    content = <p>Loading...</p>;
  }
  if (groupsData?.length === 0) {
    content = <p className="text-xl">No joined groups found</p>;
  } else if (groupsData?.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        {groupsData?.map((group: IGroup) => (
          <JoinedGroupCard key={group?._id} group={group} />
        ))}
      </div>
    );
  }
  return (
    <section className="w-full pt-2 pb-7 mt-7 border-[#9EA1B3] border-b">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Joined Groups
        </h1>
        <button className="text-primary hover:underline">Show more</button>
      </div>
      {/* Content Section */}
      {content}
    </section>
  );
};

export default JoinedGroups;
