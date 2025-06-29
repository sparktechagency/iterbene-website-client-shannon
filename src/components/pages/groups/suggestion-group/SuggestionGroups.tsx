"use client";
import { useGetSuggestionsGroupsQuery } from "@/redux/features/group/groupApi";
import { IGroup } from "@/types/group.types";
import React, { useEffect, useState } from "react";
import SuggestionGroupCard from "./SuggestionGroupCard";
import MyGroupCardSkeleton from "../my-groups/MyGroupCardSkeleton";

const SuggestionGroups: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [allSuggestedGroups, setAllSuggestedGroups] = useState<IGroup[]>([]);
  const { data: responseData, isLoading } = useGetSuggestionsGroupsQuery(
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
        // First page - replace all suggested groups
        setAllSuggestedGroups(groupsData);
      } else {
        // Additional pages - append only new unique suggested groups
        setAllSuggestedGroups((prev) => {
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

  // If no data and not loading, return null to hide the component
  if (!isLoading && !isLoadingMore && allSuggestedGroups?.length === 0) {
    return null;
  }

  let content = null;
  if (isLoading || isLoadingMore) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <MyGroupCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  } else if (allSuggestedGroups?.length === 0) {
    content = <p className="text-center">No suggested groups found</p>;
  } else if (allSuggestedGroups?.length > 0) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allSuggestedGroups?.map((group: IGroup) => (
          <SuggestionGroupCard key={group?._id} group={group} />
        ))}
      </div>
    );
  }

  return (
    <section className="w-full border-b pb-7 border-gray-400">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          You Might Like
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

export default SuggestionGroups;