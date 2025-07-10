"use client";
import { IMedia } from "@/types/post.types";
import Image from "next/image";
import VideoCard from "../../UserProfilePage/UserVideos/VideoCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import useWindowSize from "@/hooks/useWindowSize";

interface PostContentRenderProps {
  data: IMedia[];
  isVisible?: boolean;
}

const PostContentRender = ({ data, isVisible }: PostContentRenderProps) => {
  const mediaCount = data?.length;
  const { width } = useWindowSize();
  const isMobile = width < 768;

  if (isMobile) {
    return (
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        navigation={{ prevEl: null, nextEl: null }}
        loop
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        className="w-full mt-3"
      >
        {data.map((media, index) => (
          <SwiperSlide key={index}>
            <div className="aspect-square">
              {media.mediaType === "image" ? (
                <Image
                  src={media?.mediaUrl}
                  alt={`Post media ${index + 1}`}
                  width={400}
                  height={350}
                  className="w-full h-full object-cover rounded-xl cursor-pointer"
                />
              ) : (
                <VideoCard
                  url={media?.mediaUrl}
                  isVisible={isVisible}
                  className="w-full h-full"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  // Single media item
  if (mediaCount === 1) {
    const media = data[0];
    return (
      <div className="w-full mt-3">
        {media.mediaType === "image" ? (
          <Image
            src={media?.mediaUrl}
            alt={`Post media`}
            width={400}
            height={350}
            className="w-full object-contain cursor-pointer rounded-md"
          />
        ) : (
          <VideoCard
            url={media?.mediaUrl}
            isVisible={isVisible}
            className="w-full h-[400px]"
          />
        )}
      </div>
    );
  }

  // Two media items
  if (mediaCount === 2) {
    return (
      <div className="grid grid-cols-2 gap-3 mt-3">
        {data.map((media, index) => (
          <div key={index} className="aspect-square">
            {media?.mediaType === "image" ? (
              <Image
                src={media?.mediaUrl}
                alt="Post media"
                width={400}
                height={350}
                className="w-full h-[350px]  rounded-xl cursor-pointer"
              />
            ) : (
              <VideoCard
                url={media?.mediaUrl}
                isVisible={isVisible}
                className="w-full h-[350px]"
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Three media items
  if (mediaCount === 3) {
    return (
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="col-span-full">
          {data[0]?.mediaType === "image" ? (
            <Image
              src={data[0]?.mediaUrl}
              alt="Post media"
              width={400}
              height={350}
              className="w-full h-[350px] object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard
              url={data[0]?.mediaUrl}
              isVisible={isVisible}
              className="h-[350px]"
            />
          )}
        </div>
        <div className="col-span-1">
          {data[1]?.mediaType === "image" ? (
            <Image
              src={data[1]?.mediaUrl}
              alt="Post media"
              width={400}
              height={260}
              className="w-full h-[260px] object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard
              url={data[1]?.mediaUrl}
              isVisible={isVisible}
              className="h-[260px]"
            />
          )}
        </div>
        <div className="col-span-1">
          {data[2]?.mediaType === "image" ? (
            <Image
              src={data[2]?.mediaUrl}
              alt="Post media"
              width={400}
              height={260}
              className="w-full h-[260px] object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[2]?.mediaUrl} isVisible={isVisible} />
          )}
        </div>
      </div>
    );
  }
  // Four media items
  if (mediaCount === 4) {
    return (
      <div className="grid grid-cols-3 gap-3 mt-3">
        <div className="row-span-2 col-span-1">
          {data[0]?.mediaType === "image" ? (
            <Image
              src={data[0]?.mediaUrl}
              alt="Post media"
              width={400}
              height={800}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[0]?.mediaUrl} isVisible={isVisible} />
          )}
        </div>
        <div className="row-span-2 col-span-1">
          {data[1]?.mediaType === "image" ? (
            <Image
              src={data[1]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[1]?.mediaUrl} isVisible={isVisible} />
          )}
        </div>
        <div className="col-span-1">
          {data[2]?.mediaType === "image" ? (
            <Image
              src={data[2]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[2]?.mediaUrl} isVisible={isVisible} />
          )}
        </div>
        <div className="col-span-1">
          {data[3]?.mediaType === "image" ? (
            <Image
              src={data[2]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[2]?.mediaUrl} isVisible={isVisible} />
          )}
        </div>
      </div>
    );
  }
  // Four media items ++
  if (mediaCount > 4) {
    return (
      <div className="grid grid-cols-3 gap-3 mt-3">
        <div className="row-span-2 col-span-1">
          {data[0]?.mediaType === "image" ? (
            <Image
              src={data[0]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[0]?.mediaUrl} isVisible={isVisible} />
          )}
        </div>
        <div className="row-span-2 col-span-1">
          {data[1]?.mediaType === "image" ? (
            <Image
              src={data[1]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[1]?.mediaUrl} isVisible={isVisible} />
          )}
        </div>
        <div className="col-span-1">
          {data[2]?.mediaType === "image" ? (
            <Image
              src={data[2]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[2]?.mediaUrl} isVisible={isVisible} />
          )}
        </div>
        <div className="col-span-1 relative">
          {data[3]?.mediaType === "image" ? (
            <Image
              src={data[2]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[2]?.mediaUrl} isVisible={isVisible} />
          )}
          <div className="absolute top-0 left-0 w-full h-full bg-black/30 rounded-xl">
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl md:text-3xl">
              {mediaCount}+
            </span>
          </div>
        </div>
      </div>
    );
  }
};

export default PostContentRender;
