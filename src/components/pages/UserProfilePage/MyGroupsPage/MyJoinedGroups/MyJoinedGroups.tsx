"use client";
import { useGetMyJoinedGroupsQuery } from "@/redux/features/group/groupApi";
import { IGroup } from "@/types/group.types";
import MyJoinedGroupCard from "./MyJoinedGroupCard";
const MyJoinedGroups: React.FC = () => {
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
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        {groupsData?.map((group: IGroup) => (
          <MyJoinedGroupCard key={group?._id} group={group} />
        ))}
      </div>
    );
  }

  return <section>{content}</section>;
};

export default MyJoinedGroups;
