"use client";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CreateStoryModal from "./create-story-modal";
import StoriesModal from "./stories-modal";
import StoryCard from "./stories.card";

interface Media {
  url: string;
  type: "image" | "video";
}

interface Story {
  id: number;
  media: Media[];
  authorName: string;
  authorImage: string;
  text?: string;
  textColor?: string;
  font?: string;
  backgroundColor?: string;
}

const Stories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [stories, setStories] = useState<Story[]>([
    {
      id: 1,
      media: [
        { url: "https://www.w3schools.com/html/mov_bbb.mp4", type: "video" },
      ],
      authorName: "Sophia Martinez",
      authorImage: "https://randomuser.me/api/portraits/women/10.jpg",
    },
    {
      id: 2,
      media: [
        { url: "https://i.ibb.co.com/Zyy6bvr/post3.jpg", type: "image" },
        { url: "https://www.w3schools.com/html/mov_bbb.mp4", type: "video" },
      ],
      authorName: "Ethan Carter",
      authorImage: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
      id: 3,
      media: [
        { url: "https://i.ibb.co.com/Z6792YGV/post2.jpg", type: "image" },
      ],
      authorName: "Ava Thompson",
      authorImage: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
      id: 4,
      media: [
        { url: "https://i.ibb.co.com/TBFhZcsc/post1.jpg", type: "image" },
      ],
      authorName: "Liam Brooks",
      authorImage: "https://randomuser.me/api/portraits/men/13.jpg",
    },
    {
      id: 5,
      media: [
        {
          url: "https://i.postimg.cc/dVP9Fh3N/2588a7b47b42d6dddfdfa08bb9300d00.jpg",
          type: "image",
        },
      ],
      authorName: "Olivia Hayes",
      authorImage: "https://randomuser.me/api/portraits/women/14.jpg",
    },
  ]);

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setIsModalOpen(true);
  };

  const handleAddStory = (newStory: Story) => {
    setStories((prev) => [...prev, newStory]);
  };

  return (
    <section className="w-full">
      <Swiper
        slidesPerView={4}
        spaceBetween={16}
        freeMode={true}
        pagination={{
          clickable: true,
          el: null,
        }}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div
            onClick={() => setIsCreateModalOpen(true)}
            className="relative w-full h-[250px] rounded-xl overflow-hidden shadow-lg cursor-pointer"
          >
            <Image
              src="https://i.postimg.cc/dVP9Fh3N/2588a7b47b42d6dddfdfa08bb9300d00.jpg"
              alt="Story Image"
              width={200}
              height={380}
              className="object-cover w-full h-full rounded-xl"
            />
            <div className="absolute p-4 rounded-xl top-0 left-0 right-0 bottom-0 bg-white/30 flex flex-col justify-end">
              <div className="flex flex-col items-center gap-5">
                <div className="size-10 bg-white flex justify-center items-center rounded-2xl">
                  <Plus size={20} className="text-gray-950 font-bold" />
                </div>
                <h1 className="text-white text-sm font-semibold">
                  Add Journey
                </h1>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {stories.map((story, index) => (
          <SwiperSlide key={story.id}>
            <div onClick={() => handleStoryClick(index)}>
              <StoryCard
                image={story.media[0].url}
                mediaType={story.media[0].type}
                authorName={story.authorName}
                authorImage={story.authorImage}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {isModalOpen && (
        <StoriesModal
          stories={stories}
          selectedStoryIndex={selectedStoryIndex}
          setSelectedStoryIndex={setSelectedStoryIndex}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isCreateModalOpen && (
        <CreateStoryModal
          onClose={() => setIsCreateModalOpen(false)}
          onAddStory={handleAddStory}
        />
      )}
    </section>
  );
};

export default Stories;
