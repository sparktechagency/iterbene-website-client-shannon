"use client";
import { IMedia } from "@/types/post.types";
import SmartImage from "@/utils/SmartImage";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import VideoCard from "../../UserProfilePage/UserVideos/VideoCard";

interface PostDetailsContentRenderProps {
  medias: IMedia[];
}

const PostDetailsContentRender = ({ medias }: PostDetailsContentRenderProps) => {
  const mediaCount = medias?.length;

  return (
    <div className="w-full relative">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={16}
        slidesPerView={1}
        navigation={{
          prevEl: ".custom-swiper-button-prev",
          nextEl: ".custom-swiper-button-next",
        }}
        pagination={{ clickable: true }}
        className="w-full"
      >
        {medias?.map((media, index) => (
          <SwiperSlide key={index}>
            {media.mediaType === "image" ? (
              <SmartImage
                src={media?.mediaUrl}
                alt={`Post media ${index + 1}`}
                container mx-autoHeight="600px"
                className="w-full h-[600px] object-contain rounded-xl cursor-pointer"
              />
            ) : (
              <VideoCard url={media?.mediaUrl} className="w-full h-[600px] object-contain" />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      {mediaCount > 1 && (
        <>
          <button
            className="custom-swiper-button-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full p-2 hover:bg-gray-800 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            className="custom-swiper-button-next absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full p-2 hover:bg-gray-800 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default PostDetailsContentRender;
