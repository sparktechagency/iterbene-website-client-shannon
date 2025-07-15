"use client";
import { useGetMyJoinedGroupsQuery } from "@/redux/features/group/groupApi";
import { useState, useEffect, useRef, useCallback } from "react";
import { IGroup } from "@/types/group.types";
import MyJoinedGroupCard from "./MyJoinedGroupCard";
import MyJoinedGroupSkeleton from "./MyJoinedGroupSkeleton";

const MyJoinedGroups = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [joinedGroups, setJoinedGroups] = useState<IGroup[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Get joined groups
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyJoinedGroupsQuery([
    { key: "page", value: currentPage.toString() },
    { key: "limit", value: "9" }
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
      setHasMore(currentPage < (responseData.data.attributes.totalPages || 0));
    }
  }, [responseData, currentPage]);

  // Set up IntersectionObserver for infinite scroll (from Posts)
  const lastGroupElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, hasMore]
  );

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
      <h1 className="text-center text-gray-500 py-8">No groups available</h1>
    );
  } else if (joinedGroups.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {joinedGroups.map((group, index) => {
          // Attach ref to the last group for infinite scroll
          if (index === joinedGroups.length - 1) {
            return (
              <div key={group._id} ref={lastGroupElementRef}>
                <MyJoinedGroupCard group={group} />
              </div>
            );
          }
          return <MyJoinedGroupCard key={group._id} group={group} />;
        })}
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
      <div ref={loaderRef} className="h-10" />
    </div>
  );
};

export default MyJoinedGroups;
