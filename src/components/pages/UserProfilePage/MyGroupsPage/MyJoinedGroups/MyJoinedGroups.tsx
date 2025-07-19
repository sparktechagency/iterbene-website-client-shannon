"use client";
import { useRef, useCallback } from "react";
import { IGroup } from "@/types/group.types";
import MyJoinedGroupCard from "./MyJoinedGroupCard";
import MyJoinedGroupSkeleton from "./MyJoinedGroupSkeleton";

interface MyJoinedGroupsProps {
  joinedGroups: IGroup[];
  setJoinedGroups: React.Dispatch<React.SetStateAction<IGroup[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  dataLoaded: boolean;
  setDataLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const MyJoinedGroups = ({
  joinedGroups,
  currentPage,
  setCurrentPage,
  hasMore,
  dataLoaded,
  isLoading,
}: MyJoinedGroupsProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Set up IntersectionObserver for infinite scroll
  const lastGroupElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setCurrentPage((prevPage) => prevPage + 1);
          }
        },
        { threshold: 0.1 }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, setCurrentPage]
  );

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <MyJoinedGroupSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  let content = null;
  if (isLoading && currentPage === 1 || !dataLoaded) {
    content = renderLoading();
  } else if (joinedGroups.length === 0 && dataLoaded) {
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
      {isLoading && currentPage > 1 && (
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