"use client";
import { Plus } from "lucide-react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import StoryCard from "./stories.card";
import { useGetStoryFeedQuery } from "@/redux/features/stories/storiesApi";
import Link from "next/link";

export interface IStory {
  _id: string;
  mediaIds: Array<{
    _id: string;
    mediaType: string;
    mediaUrl: string;
    thumbnailUrl?: string;
    duration?: number;
    textContent?: string;
  }>;
  userId: { fullName: string; profileImage: string };
  privacy: string;
  expiresAt: string;
}

const Stories = () => {
  const { data:responseData, error, isLoading } = useGetStoryFeedQuery(undefined);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10">Error loading stories</div>;

  const stories: IStory[] = responseData?.data?.attributes?.results || [];

  console.log(stories)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stories</h1>
      <Swiper
        slidesPerView={5}
        spaceBetween={16}
        freeMode={true}
        pagination={{ clickable: true, el: null }}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Link href="/story/create">
            <div className="relative w-full h-[250px] rounded-xl overflow-hidden shadow-lg cursor-pointer bg-gradient-to-t from-black/50 to-transparent">
              <Image
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt="Add Story"
                width={200}
                height={380}
                className="object-cover w-full h-full rounded-xl opacity-70"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-white">
                <div className="size-12 bg-white/20 flex items-center justify-center rounded-full">
                  <Plus size={24} className="text-white" />
                </div>
                <h2 className="text-sm font-semibold mt-2">Add Story</h2>
              </div>
            </div>
          </Link>
        </SwiperSlide>
        {stories.map((story) => (
          <SwiperSlide key={story._id}>
            <Link href={`/story/${story._id}`}>
              <StoryCard
               stroy={story}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Stories;
