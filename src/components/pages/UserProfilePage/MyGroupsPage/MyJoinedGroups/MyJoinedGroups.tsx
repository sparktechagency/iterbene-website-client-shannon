"use client";
import { useGetMyJoinedGroupsQuery } from "@/redux/features/group/groupApi";
import { useState, useEffect, useRef } from "react";
import { IGroup } from "@/types/group.types";
import MyJoinedGroupCard from "./MyJoinedGroupCard";
import MyJoinedGroupSkeleton from "./MyJoinedGroupSkeleton";

const MyJoinedGroups = ({ sortBy }: { sortBy: string }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [joinedGroups, setJoinedGroups] = useState<IGroup[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Get joined groups
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyJoinedGroupsQuery([
    { key: "page", value: currentPage },
    { key: "limit", value: 9 },
    { key: "sortBy", value: sortBy },
  ]);

  // Update joined groups when new data is fetched, ensuring no duplicate _id values
  useEffect(() => {
    const myAllJoinedGroups = responseData?.data?.attributes?.results || [];
    if (myAllJoinedGroups?.length > 0) {
      setJoinedGroups((prev) => {
        const existingIds = new Set(prev.map((group) => group._id));
        const newGroups = myAllJoinedGroups.filter(
          (group: IGroup) => !existingIds.has(group._id)
        );
        return currentPage === 1 ? newGroups : [...prev, ...newGroups];
      });
    }
  }, [responseData, currentPage]);

  // Reset joined groups when sortBy changes
  useEffect(() => {
    setJoinedGroups([]);
    setCurrentPage(1);
  }, [sortBy]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const totalResults = responseData?.data?.attributes?.totalResults || 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          !isFetching &&
          joinedGroups.length < totalResults
        ) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isLoading, isFetching, joinedGroups.length, responseData, currentPage]);

  // const handleItemRemove = (itemId: string) => {
  //   setJoinedGroups((prev) =>
  //     prev.filter((group) => group._id !== itemId)
  //   );
  // };

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <MyJoinedGroupSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  let content = null;
  if (isLoading && currentPage === 1) {
    content = renderLoading();
  } else if (joinedGroups.length === 0 && !isLoading) {
    content = (
      <h1 className="text-center text-gray-500 py-8">
        No groups available
      </h1>
    );
  } else if (joinedGroups.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {joinedGroups?.map((group, index) => (
          <MyJoinedGroupCard
            key={`${group._id}-${index}`}
            group={group}
            // onRemove={() => handleItemRemove(group._id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {content}
      {isFetching && currentPage > 1 && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <MyJoinedGroupSkeleton key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default MyJoinedGroups;