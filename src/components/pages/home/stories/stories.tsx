"use client";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import StoryCard from "./stories.card";
import { useGetFeedStoriesQuery } from "@/redux/features/stories/storiesApi";
import { IStory } from "@/types/stories.types";
import { Swiper as SwiperCore } from "swiper/types";

const Stories = () => {
  const { data: storiesData } = useGetFeedStoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const router = useRouter();
  const [stories, setStories] = useState<IStory[]>([]);
  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    if (storiesData?.data?.attributes?.results) {
      setStories(storiesData?.data?.attributes?.results);
    }
  }, [storiesData]);

  const handleAddJourney = () => {
    router.push("/stories/create");
  };

  const handleStoryClick = (storyId: number | string) => {
    router.push(`/story/${storyId}`);
  };

  return (
    <section className="w-full relative">
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        slidesPerView={2.5} // Mobile view
        breakpoints={{
          350: { slidesPerView: 3, spaceBetween: 16 },
          // sm
          500: { slidesPerView: 4, spaceBetween: 16 },
          // md
          768: { slidesPerView: 4.5, spaceBetween: 16 },
          // lg
          1024: { slidesPerView: 5.5, spaceBetween: 16 },
          // xl
          1280: { slidesPerView: 6.5, spaceBetween: 16 },
          // 2xl
          1536: { slidesPerView: 4.5, spaceBetween: 16 },
        }}
        spaceBetween={8}
        freeMode={true}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div
            className="relative w-full h-[190px] md:h-[210px] rounded-xl overflow-hidden shadow-lg cursor-pointer group"
            onClick={handleAddJourney}
          >
            <Image
              src="https://iter-bene.s3.eu-north-1.amazonaws.com/uploads/users/a62e7936-b779-4b00-bbcb-99371f3b79ad.jpg"
              alt="Add Journey"
              fill
              className="object-cover w-full h-full rounded-xl group-hover:scale-105 transition-transform duration-300"
            />

            <div className="absolute p-4 rounded-xl top-0 left-0 right-0 bottom-0 bg-black/40 flex flex-col justify-end">
              <div className="flex flex-col items-center gap-3">
                <div className="size-10 bg-white flex justify-center items-center rounded-full shadow-md">
                  <Plus size={24} className="text-gray-800 font-bold" />
                </div>
                <h1 className="text-white text-sm font-semibold text-center">
                  Create Story
                </h1>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {stories?.map((story) => (
          <SwiperSlide key={story._id}>
            <div onClick={() => handleStoryClick(story._id)}>
              <StoryCard story={story} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Stories;
