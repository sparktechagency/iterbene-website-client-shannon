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
import StoryCardSkeleton from "./StoryCardSkeleton"; // Adjust import path as needed
import { useGetFeedStoriesQuery } from "@/redux/features/stories/storiesApi";
import { IStory } from "@/types/stories.types";
import { Swiper as SwiperCore } from "swiper/types";
import useUser from "@/hooks/useUser";

const Stories = () => {
  const user = useUser();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data: storiesData, isLoading } = useGetFeedStoriesQuery(
    { page, limit },
    { refetchOnMountOrArgChange: true, skip: !user }
  );
  const router = useRouter();
  const [stories, setStories] = useState<IStory[]>([]);
  const swiperRef = useRef<SwiperCore | null>(null);

  useEffect(() => {
    if (storiesData?.data?.attributes?.results) {
      setStories(storiesData?.data?.attributes?.results);
    }
  }, [storiesData]);

  const handleAddJourney = () => {
    router.push("/stories");
  };

  const handleStoryClick = (storyId: number | string) => {
    router.push(`/story/${storyId}`);
  };

  const handleNextPage = () => {
    if (storiesData?.data?.attributes?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <>
      {user && (
        <section className="w-full relative">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesPerView={2.5}
            breakpoints={{
              350: { slidesPerView: 3, spaceBetween: 16 },
              500: { slidesPerView: 4, spaceBetween: 16 },
              768: { slidesPerView: 4.5, spaceBetween: 16 },
              1024: { slidesPerView: 5.5, spaceBetween: 16 },
              1280: { slidesPerView: 5, spaceBetween: 16 },
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
                  src="https://iter-bene.s3.eu-north-1.amazonaws.com/basic/story.webp"
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
                      Add Journey
                    </h1>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {isLoading
              ? Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <SwiperSlide key={`skeleton-${index}`}>
                      <StoryCardSkeleton />
                    </SwiperSlide>
                  ))
              : stories?.map((story) => (
                  <SwiperSlide key={story._id}>
                    <div onClick={() => handleStoryClick(story._id)}>
                      <StoryCard story={story} />
                    </div>
                  </SwiperSlide>
                ))}
          </Swiper>

          {/* Pagination Controls */}
          {storiesData?.data?.attributes?.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <div
                onClick={handlePrevPage}
                onKeyDown={(e) => e.key === "Enter" && handlePrevPage()}
                role="button"
                tabIndex={0}
                aria-disabled={page === 1}
                className={`px-4 py-2 bg-primary text-white rounded-xl ${
                  page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                Previous
              </div>
              <span className="text-sm font-semibold">
                Page {page} of {storiesData?.data?.attributes?.totalPages || 1}
              </span>
              <div
                onClick={handleNextPage}
                onKeyDown={(e) => e.key === "Enter" && handleNextPage()}
                role="button"
                tabIndex={0}
                aria-disabled={!storiesData?.data?.attributes?.hasNextPage}
                className={`px-4 py-2 bg-primary text-white rounded-xl ${
                  !storiesData?.data?.attributes?.hasNextPage
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                Next
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default Stories;
