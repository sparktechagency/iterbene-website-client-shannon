"use client";
import { useGetMyInvitedGroupsQuery } from "@/redux/features/group/groupApi";
import { IGroupInvite } from "@/types/group.types";
import React, { useEffect, useState } from "react";
import InvitedGroupCard from "./invited-group-card";
import MyGroupCardSkeleton from "../my-groups/MyGroupCardSkeleton";

const InvitedGroups: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [allInvitedGroups, setAllInvitedGroups] = useState<IGroupInvite[]>([]);
  const { data: responseData, isLoading } = useGetMyInvitedGroupsQuery(
    [
      {
        key: "page",
        value: currentPage,
      },
      {
        key: "limit",
        value: 6,
      },
    ],
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const groupsData = responseData?.data?.attributes?.results;
  const totalPages = responseData?.data?.attributes?.totalPages;

  useEffect(() => {
    if (groupsData && groupsData?.length > 0) {
      if (currentPage === 1) {
        // First page - replace all invited groups
        setAllInvitedGroups(groupsData);
      } else {
        // Additional pages - append only new unique invited groups
        setAllInvitedGroups((prev) => {
          const existingIds = new Set(prev.map((group) => group._id));
          const newGroups = groupsData.filter(
            (group: IGroupInvite) => !existingIds.has(group._id)
          );
          return [...prev, ...newGroups];
        });
      }
      setIsLoadingMore(false);
    }
  }, [groupsData, currentPage]);

  const handleViewMore = () => {
    if (currentPage < totalPages) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleOptimisticUpdateUi = (invitedId: string) => {
    setAllInvitedGroups((prev) =>
      prev.filter((invited) => invited._id !== invitedId)
    );
  };

  const hasMoreData = currentPage < totalPages;
  const showViewMoreButton =
    !isLoading && hasMoreData && groupsData?.length > 0;

  // If no data and not loading, return null to hide the component
  if (!isLoading && !isLoadingMore && allInvitedGroups?.length === 0) {
    return null;
  }

  let content = null;
  if (isLoading || isLoadingMore) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <MyGroupCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  } else if (allInvitedGroups?.length === 0) {
    content = <p className="text-center">No invited groups found</p>;
  } else if (allInvitedGroups?.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allInvitedGroups?.map((group: IGroupInvite) => (
          <InvitedGroupCard
            key={group?._id}
            group={group}
            handleOptimisticUpdateUi={handleOptimisticUpdateUi}
          />
        ))}
      </div>
    );
  }

  return (
    <section className="w-full border-b pb-7 border-gray-400">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Your Groups Await
        </h1>
        {showViewMoreButton && (
          <button
            onClick={handleViewMore}
            disabled={isLoadingMore}
            className="text-primary hover:underline cursor-pointer"
          >
            Show more
          </button>
        )}
      </div>

      {/* Content Section */}
      {content}
    </section>
  );
};

export default InvitedGroups;
