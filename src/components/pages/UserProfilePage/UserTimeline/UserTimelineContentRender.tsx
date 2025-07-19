"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import VideoCard from "../../UserProfilePage/UserVideos/VideoCard";
import { IMedia } from "@/types/post.types";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface UserTimelineContentRenderProps {
  data: IMedia[];
}

const UserTimelineContentRender = ({
  data,
}: UserTimelineContentRenderProps) => {
  return (
    <div className="w-full ">
      <Swiper
        modules={[Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: false }}
        className="w-full"
      >
        {data?.map((media, index) => (
          <SwiperSlide key={index}>
              <div className="w-full flex items-center justify-center">
                {media.mediaType === "image" ? (
                  <Image
                    src={media.mediaUrl}
                    alt={`Timeline media ${index + 1}`}
                    width={500}
                    height={300}
                    className="w-full h-[300px] object-cover cursor-pointer rounded-xl"
                    priority={index === 0} // Optimize loading for the first image
                  />
                ) : (
                  <VideoCard
                    url={media.mediaUrl}
                    className="w-full h-[200px] md:h-[300px]  rounded-xl"
                  />
                )}
              </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default UserTimelineContentRender;
