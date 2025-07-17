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
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";
import { VideoProvider } from "@/context/VideoContext";

interface PostContentRenderProps {
  data: IMedia[];
  isVisible?: boolean;
}

const PostContentRender = ({ data, isVisible }: PostContentRenderProps) => {
  const mediaCount = data?.length;
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageSlides = data
    .filter((media) => media.mediaType === "image")
    .map((media) => ({ src: media.mediaUrl }));

  const handleImageClick = (clickedMedia: IMedia) => {
    const imageIndex = imageSlides.findIndex(
      (slide) => slide.src === clickedMedia.mediaUrl
    );
    if (imageIndex !== -1) {
      setCurrentIndex(imageIndex);
      setOpen(true);
    }
  };

  const renderDesktopLayout = () => {
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
              onClick={() => handleImageClick(media)}
              priority
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
                  onClick={() => handleImageClick(media)}
                  priority={index === 0}
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
                onClick={() => handleImageClick(data[0])}
                priority
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
                onClick={() => handleImageClick(data[1])}
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
                onClick={() => handleImageClick(data[2])}
              />
            ) : (
              <VideoCard url={data[2]?.mediaUrl} isVisible={isVisible} />
            )}
          </div>
        </div>
      );
    }

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
                onClick={() => handleImageClick(data[0])}
                priority
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
                onClick={() => handleImageClick(data[1])}
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
                onClick={() => handleImageClick(data[2])}
              />
            ) : (
              <VideoCard url={data[2]?.mediaUrl} isVisible={isVisible} />
            )}
          </div>
          <div className="col-span-1">
            {data[3]?.mediaType === "image" ? (
              <Image
                src={data[3]?.mediaUrl}
                alt="Post media"
                width={400}
                height={400}
                className="w-full h-full object-cover rounded-xl cursor-pointer"
                onClick={() => handleImageClick(data[3])}
              />
            ) : (
              <VideoCard url={data[3]?.mediaUrl} isVisible={isVisible} />
            )}
          </div>
        </div>
      );
    }

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
                onClick={() => handleImageClick(data[0])}
                priority
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
                onClick={() => handleImageClick(data[1])}
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
                onClick={() => handleImageClick(data[2])}
              />
            ) : (
              <VideoCard url={data[2]?.mediaUrl} isVisible={isVisible} />
            )}
          </div>
          <div
            className="col-span-1 relative"
            onClick={() => handleImageClick(data[3])}
          >
            {data[3]?.mediaType === "image" ? (
              <Image
                src={data[3]?.mediaUrl}
                alt="Post media"
                width={400}
                height={400}
                className="w-full h-full object-cover rounded-xl cursor-pointer"
              />
            ) : (
              <VideoCard url={data[3]?.mediaUrl} isVisible={isVisible} />
            )}
            <div className="absolute top-0 left-0 w-full h-full bg-black/30 rounded-xl cursor-pointer">
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl md:text-3xl">
                {mediaCount - 3}+
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {isMobile ? (
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
                    onClick={() => handleImageClick(media)}
                    priority={index === 0}
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
      ) : (
        <VideoProvider>{renderDesktopLayout()}</VideoProvider>
      )}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={imageSlides}
        index={currentIndex}
      />
    </>
  );
};

export default PostContentRender;
