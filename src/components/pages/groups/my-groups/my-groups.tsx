"use client";
import { useGetMyGroupsQuery } from "@/redux/features/group/groupApi";
import { IGroup } from "@/types/group.types";
import React, { useEffect, useState } from "react";
import MyGroupCard from "./my-group-card";
import MyGroupCardSkeleton from "./MyGroupCardSkeleton";

const MyGroups: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [allMyGroups, setAllMyGroups] = useState<IGroup[]>([]);
  const { data: responseData, isLoading } = useGetMyGroupsQuery(
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
        // First page - replace all groups
        setAllMyGroups(groupsData);
      } else {
        // Additional pages - append only new unique groups
        setAllMyGroups((prev) => {
          const existingIds = new Set(prev.map((group) => group._id));
          const newGroups = groupsData.filter(
            (group: IGroup) => !existingIds.has(group._id)
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

  const hasMoreData = currentPage < totalPages;
  const showViewMoreButton =
    !isLoading && hasMoreData && groupsData?.length > 0;

  const handleOptimisticRemoveGroup = (groupId: string) => {
    setAllMyGroups((prev) => prev.filter((group) => group._id !== groupId));
  };

  let content = null;
  if (isLoading || isLoadingMore) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <MyGroupCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  } else if (allMyGroups?.length === 0) {
    content = (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Groups Yet
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          You haven&apos;t created any groups yet. Start building your community
          by creating your first group!
        </p>
      </div>
    );
  } else if (allMyGroups?.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allMyGroups?.map((group: IGroup) => (
          <MyGroupCard
            key={group?._id}
            group={group}
            handleOptimisticRemoveGroup={handleOptimisticRemoveGroup}
          />
        ))}
      </div>
    );
  }

  // If no data and not loading, return null to hide the component
  if (!isLoading && !isLoadingMore && allMyGroups?.length === 0) {
    return null;
  }
  return (
    <section className="w-full border-b border-gray-200 pb-8 mb-8">
      {/* Header Section */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              My Groups
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Groups you&apos;ve created and manage
            </p>
          </div>
        </div>
        {showViewMoreButton && (
          <button
            onClick={handleViewMore}
            disabled={isLoadingMore}
            className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/5 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            {isLoadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              <>
                Show more
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>
        )}
      </div>

      {/* Content Section */}
      {content}
    </section>
  );
};

export default MyGroups;
