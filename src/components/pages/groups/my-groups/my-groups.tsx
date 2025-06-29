"use client";
import { useGetMyGroupsQuery } from "@/redux/features/group/groupApi";
import { IGroup } from "@/types/group.types";
import React from "react";
import MyGroupCard from "./my-group-card";
import MyGroupCardSkeleton from "./MyGroupCardSkeleton";
const MyGroups: React.FC = () => {
  const { data: responseData, isLoading } = useGetMyGroupsQuery(undefined);
  const groupsData = responseData?.data?.attributes?.results;
  let content = null;
  if (!isLoading) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <MyGroupCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  } else if (groupsData?.length === 0) {
    content = <p className="text-xl">No groups found</p>;
  } else if (groupsData?.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        {groupsData?.map((group: IGroup) => (
          <MyGroupCard key={group?.name} group={group} />
        ))}
      </div>
    );
  }
  return (
    <section className="w-full">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          My Groups
        </h1>
        <button className="text-primary hover:underline">Show more</button>
      </div>

      {/* Content Section */}
      {content}
    </section>
  );
};

export default MyGroups;
