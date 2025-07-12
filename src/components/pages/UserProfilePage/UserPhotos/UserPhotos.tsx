"use client";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useState, useEffect, useRef, useMemo } from "react";
import { IMedia, IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import UserPhotoCard from "./UserPhotoCard";
import UserPhotosSkeleton from "./UserPhotosSkeleton";

const UserPhotos = () => {
  const { userName } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [timelinePosts, setTimelinePosts] = useState<IPost[]>([]);
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Get user timeline posts with images
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetUserTimelinePostsQuery(
    {
      username: userName,
      filters: [
        { key: "mediaType", value: "image" },
        { key: "page", value: currentPage },
        { key: "limit", value: 8 },
      ],
    },
    { refetchOnMountOrArgChange: true, skip: !userName }
  );

  // Update timeline posts when new data is fetched, ensuring no duplicate _id values
  useEffect(() => {
    const userTimelineImageData = responseData?.data?.attributes?.results || [];
    if (userTimelineImageData?.length > 0) {
      setTimelinePosts((prev) => {
        const existingIds = new Set(prev.map((post) => post._id));
        const newPosts = userTimelineImageData.filter(
          (post: IPost) => !existingIds.has(post._id)
        );
        return currentPage === 1 ? newPosts : [...prev, ...newPosts];
      });
    }
  }, [responseData, currentPage]);

  // Reset timeline posts when userName changes
  useEffect(() => {
    setTimelinePosts([]);
    setCurrentPage(1);
  }, [userName]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const totalResults = responseData?.data?.attributes?.totalResults || 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          !isFetching &&
          timelinePosts.length < totalResults
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
  }, [isLoading, isFetching, timelinePosts.length, responseData, currentPage]);

  // Flatten all media items into a single array for easier handling
  const allMediaItems = useMemo(() => {
    if (!timelinePosts) return [];

    const flattened = timelinePosts.flatMap((post: IPost) =>
      post.media
        .filter((media) => media.mediaType === "image")
        .map((media) => ({
          ...media,
          postId: post._id,
        }))
    );
    return flattened;
  }, [timelinePosts]);

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

  const renderLoading = () => (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <UserPhotosSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  let content = null;
  if (isLoading && currentPage === 1) {
    content = renderLoading();
  } else if (allMediaItems.length === 0 && !isLoading) {
    content = (
      <h1 className="text-center text-gray-500 py-8">
        No timeline photos available
      </h1>
    );
  } else if (allMediaItems.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {allMediaItems?.map((media, index) => (
          <UserPhotoCard
            key={`${media._id}-${index}`}
            handleImageClick={handleImageClick}
            index={index}
            media={media}
          />
        ))}
      </div>
    );
  }

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
      {content}
      {isFetching && currentPage > 1 && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <UserPhotosSkeleton key={`skeleton-more-${index}`} />
          ))}
        </div>
      )}
      <div ref={observerRef} className="h-10" />
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
