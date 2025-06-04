"use client";
import { useGetMyInvitedGroupsQuery } from "@/redux/features/group/groupApi";
import MyInvitationsGroupCard from "./MyInvitationsGroupCard";
import { useState } from "react";
import MyInvitationsGroupSkeleton from "./MyInvitationsGroupSkeleton";
import InfiniteScrollWrapper from "@/components/custom/InfiniteScrollWrapper";
import { IGroupInvite } from "@/types/group.types";

const MyInvitationsGroups = ({ sortBy }: { sortBy: string }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  // get my myAllInvitedGroups groups
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyInvitedGroupsQuery([
    { key: "page", value: currentPage },
    { key: "limit", value: 9 },
    { key: "sortBy", value: sortBy },
  ]);

  const myAllInvitedGroups = responseData?.data?.attributes?.results || [];
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
        <MyInvitationsGroupSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  return (
    <InfiniteScrollWrapper<IGroupInvite>
      items={myAllInvitedGroups}
      isLoading={isLoading && currentPage === 1}
      isFetching={isFetching}
      hasMore={
        myAllInvitedGroups?.length + (currentPage - 1) * 9 < totalResults
      }
      renderItem={(group: IGroupInvite) => (
        <MyInvitationsGroupCard key={group?._id} group={group} />
      )}
      renderLoading={renderLoading}
      renderNoData={() => (
        <h1 className="text-center text-gray-500 py-8">
          No invited groups available
        </h1>
      )}
      onFetchMore={fetchMoreData}
      onRefresh={refreshData}
      gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      keyExtractor={(connection: IGroupInvite) => connection._id}
    />
  );
};

export default MyInvitationsGroups;
