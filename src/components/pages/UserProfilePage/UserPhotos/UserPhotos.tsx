"use client";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { IMedia, IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import UserPhotoCard from "./UserPhotoCard";
import UserPhotosSkeleton from "./UserPhotosSkeleton";
import InfiniteScrollWrapper from "@/components/custom/InfiniteScrollWrapper";

const UserPhotos = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const { userName } = useParams();

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
          value: "image",
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

  const userTimelineImageData = responseData?.data?.attributes?.results;
  const totalResults = responseData?.data?.attributes?.totalResults;

  // Flatten all media items into a single array for easier handling
  const allMediaItems = useMemo(() => {
    if (!userTimelineImageData) return [];

    const flattened = userTimelineImageData.flatMap((post: IPost) =>
      post.media
        .filter((media) => media.mediaType === "image")
        .map((media) => ({
          ...media,
          postId: post._id,
        }))
    );
    return flattened;
  }, [userTimelineImageData]);

  // Create slides array for lightbox
  const lightboxSlides = useMemo(() => {
    return allMediaItems.map((media: IMedia) => ({
      src: media.mediaUrl,
      alt: media._id || "Photo",
    }));
  }, [allMediaItems]);

  const handleImageClick = (mediaIndex: number) => {
    setPhotoIndex(mediaIndex);
    setOpen(true);
  };
  const fetchMoreData = () => {
    if (!isLoading && !isFetching) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const refreshData = () => {
    setCurrentPage(1);
  };
  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <UserPhotosSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  return (
    <div className="w-full bg-white p-5 rounded-2xl">
      {/* Header with Title */}
      <div className="flex justify-between mb-4 border-b border-[#B5B7C5] pb-4">
        <h2 className="text-lg font-semibold text-gray-800">Photos</h2>
        <span className="text-sm text-gray-500">
          {allMediaItems.length} photo{allMediaItems.length !== 1 ? "s" : ""}
        </span>
      </div>
      {/* Photo Grid */}
      <InfiniteScrollWrapper<IPost>
        items={userTimelineImageData}
        isLoading={isLoading && currentPage === 1}
        isFetching={isFetching}
        hasMore={
          userTimelineImageData?.length + (currentPage - 1) * 9 < totalResults
        }
        renderItem={(video: IPost) =>
          video.media?.map((media, index) => {
            return (
              <UserPhotoCard
                key={index}
                handleImageClick={handleImageClick}
                index={index}
                media={media}
              />
            );
          })
        }
        renderLoading={renderLoading}
        renderNoData={() => (
          <h1 className="text-center text-gray-500 py-8">
            No timeline photos available
          </h1>
        )}
        onFetchMore={fetchMoreData}
        onRefresh={refreshData}
        gridCols="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        keyExtractor={(post: IPost) => post?._id}
      />

      {/* Lightbox */}
      {lightboxSlides.length > 0 && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={lightboxSlides}
          index={photoIndex}
          on={{
            view: ({ index }) => setPhotoIndex(index),
          }}
          carousel={{
            finite: lightboxSlides.length <= 1,
          }}
          render={{
            buttonPrev: lightboxSlides.length <= 1 ? () => null : undefined,
            buttonNext: lightboxSlides.length <= 1 ? () => null : undefined,
          }}
        />
      )}
    </div>
  );
};

export default UserPhotos;
