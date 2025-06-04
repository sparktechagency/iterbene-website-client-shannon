"use client";
import { useGetMyJoinedGroupsQuery } from "@/redux/features/group/groupApi";
import { IGroup } from "@/types/group.types";
import MyJoinedGroupCard from "./MyJoinedGroupCard";
import { useState } from "react";
import MyJoinedGroupSkeleton from "./MyJoinedGroupSkeleton";
import InfiniteScrollWrapper from "@/components/custom/InfiniteScrollWrapper";
const MyJoinedGroups = ({sortBy}:{sortBy:string}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  // get my myAllJoinedGroups groups
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyJoinedGroupsQuery([
    { key: "page", value: currentPage },
    { key: "limit", value: 9 },
    { key: "sortBy", value: sortBy },
  ]);

  const myAllJoinedGroups = responseData?.data?.attributes?.results || [];
  const totalResults = responseData?.data?.attributes?.totalResults || 0;

  const fetchMoreData = () => {
    if (!isLoading && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const refreshData = () => {
    setCurrentPage(1);
  };

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <MyJoinedGroupSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
  return (
    <InfiniteScrollWrapper<IGroup>
      items={myAllJoinedGroups}
      isLoading={isLoading && currentPage === 1}
      isFetching={isFetching}
      hasMore={myAllJoinedGroups?.length + (currentPage - 1) * 9 < totalResults}
      renderItem={(group: IGroup) => (
        <MyJoinedGroupCard key={group?._id} group={group} />
      )}
      renderLoading={renderLoading}
      renderNoData={() => (
        <h1 className="text-center text-gray-500 py-8">No groups available</h1>
      )}
      onFetchMore={fetchMoreData}
      onRefresh={refreshData}
      gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      keyExtractor={(connection: IGroup) => connection._id}
    />
  );
};

export default MyJoinedGroups;
