"use client";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import UserIteItineraryCard from "./UserIteItineraryCard";
import { useState } from "react";
import UserTimelineSkeletonCard from "../UserTimeline/UserTimelineSkeletonCard";
import InfiniteScrollWrapper from "@/components/custom/InfiniteScrollWrapper";

const UserIteItinerary = () => {
  const { userName } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [removePostIds, setRemovePostIds] = useState<string[]>([]);
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetUserTimelinePostsQuery(
    {
      username: userName,
      filters: [
        {
          key: "mediaType",
          value: "itinerary",
        },
        {
          key: "page",
          value: currentPage,
        },
        {
          key: "limit",
          value: 9,
        },
      ],
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !userName,
    }
  );
  const userItineraryData = responseData?.data?.attributes?.results;
  const totalResults = responseData?.data?.attributes?.totalResults;

  const fetchMoreData = () => {
    if (!isLoading && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const refreshData = () => {
    setCurrentPage(1);
    setRemovePostIds([]);
  };

  const handleRemovePost = (postId: string) => {
    setRemovePostIds((prev) => [...prev, postId]);
  };
  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <UserTimelineSkeletonCard key={`skeleton-${index}`} />
      ))}
    </div>
  );

  return (
    <InfiniteScrollWrapper<IPost>
      items={userItineraryData}
      isLoading={isLoading && currentPage === 1}
      isFetching={isFetching}
      hasMore={userItineraryData?.length + (currentPage - 1) * 9 < totalResults}
      renderItem={(post: IPost) => (
        <UserIteItineraryCard
          key={post._id}
          post={post}
          onRemove={() => handleRemovePost(post._id)}
        />
      )}
      renderLoading={renderLoading}
      renderNoData={() => (
        <h1 className="text-center text-gray-500 py-8">No Post available</h1>
      )}
      onFetchMore={fetchMoreData}
      onRefresh={refreshData}
      onItemRemove={handleRemovePost}
      removedItemIds={removePostIds}
      gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      keyExtractor={(post: IPost) => post._id}
    />
  );
};

export default UserIteItinerary;
