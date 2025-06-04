"use client";
import { useParams } from "next/navigation";
import VideoCard from "./VideoCard";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
import { useState } from "react";
import InfiniteScrollWrapper from "@/components/custom/InfiniteScrollWrapper";
import UserVideoSkeleton from "./UserVideoSkeleton";
const UserVideos = () => {
  const { userName } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
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
          value: "video",
        },
        {
          key: "page",
          value: currentPage,
        },
        {
          key: "limit",
          value: 8,
        },
      ],
    },
    { refetchOnMountOrArgChange: true, skip: !userName }
  );
  const userTimelineVideoData = responseData?.data?.attributes?.results;
  const totalResults = responseData?.data?.attributes?.totalResults;

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
        <UserVideoSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
  return (
    <div className="w-full bg-white p-5 rounded-2xl">
      {/* Header with Title and Edit Button */}
      <div className="flex justify-between mb-4 border-b border-[#B5B7C5] pb-4">
        <h2 className="text-lg font-semibold text-gray-800">Videos</h2>
      </div>
      <InfiniteScrollWrapper<IPost>
        items={userTimelineVideoData}
        isLoading={isLoading && currentPage === 1}
        isFetching={isFetching}
        hasMore={
          userTimelineVideoData?.length + (currentPage - 1) * 9 < totalResults
        }
        renderItem={(video: IPost, index: number) =>
          video.media?.map((media) => {
            return <VideoCard key={index} url={media?.mediaUrl} />;
          })
        }
        renderLoading={renderLoading}
        renderNoData={() => (
          <h1 className="text-center text-gray-500 py-8">
            No timeline videos available
          </h1>
        )}
        onFetchMore={fetchMoreData}
        onRefresh={refreshData}
        gridCols="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        keyExtractor={(post: IPost) => post?._id}
      />
    </div>
  );
};

export default UserVideos;
