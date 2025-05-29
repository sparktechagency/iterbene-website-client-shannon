"use client";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { IMedia, IPost } from "@/types/post.types";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const UserPhotos = () => {
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const { userName } = useParams();

  const {
    data: responseData,
    isLoading,
  } = useGetUserTimelinePostsQuery(
    {
      username: userName,
      filters: [
        {
          key: "mediaType",
          value: "image",
        },
      ],
    },
    { refetchOnMountOrArgChange: true, skip: !userName }
  );

  const userTimelineImageData = responseData?.data?.attributes?.results;

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
    return allMediaItems.map((media:IMedia) => ({
      src: media.mediaUrl,
      alt: media._id || "Photo",
    }));
  }, [allMediaItems]);

  const handleImageClick = (mediaIndex: number) => {
    setPhotoIndex(mediaIndex);
    setOpen(true);
  };


  if (isLoading) {
    return (
      <div className="w-full bg-white p-5 rounded-2xl">
        <div className="text-center py-8">Loading photos...</div>
      </div>
    );
  }

  if (!userTimelineImageData?.length || !allMediaItems.length) {
    return (
      <div className="w-full bg-white p-5 rounded-2xl">
        <div className="flex justify-between mb-4 border-b border-[#B5B7C5] pb-4">
          <h2 className="text-lg font-semibold text-gray-800">Photos</h2>
        </div>
        <div className="text-center py-8 text-gray-500">No photos found</div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {userTimelineImageData?.map((photo: IPost, index: number) =>
          photo.media.map((media:IMedia) => (
            <div
              key={media._id}
              className="w-full h-56 md:h-80 relative cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={media?.mediaUrl}
                alt={media?._id}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 25vw, 25vw"
                priority={index < 4} // Prioritize loading for the first row
              />
            </div>
          ))
        )}
      </div>

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
