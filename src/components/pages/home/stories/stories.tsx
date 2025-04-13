"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper/modules";
import StoryCard from "./stories.card";
import Image from "next/image";
import {Plus } from "lucide-react";

const Stories = () => {
  const storyData = [
    {
      id: 1,
      image: "https://i.ibb.co.com/fVPxB1rZ/story1.jpg", // Replace with your image URLs
      authorName: "Joey Brown",
      authorImage:
        "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg", // Replace with your image URLs
    },
    {
      id: 2,
      image: "https://i.ibb.co.com/ZzbvF6jw/story2.jpg", // Replace with your image URLs
      authorName: "Joey Brown",
      authorImage:
        "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg", // Replace with your image URLs
    },
    {
      id: 3,
      image: "https://i.ibb.co.com/HTbVFmgj/story3.jpg", // Replace with your image URLs
      authorName: "Joey Brown",
      authorImage:
        "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg", // Replace with your image URLs
    },
    {
      id: 4,
      image: "https://i.ibb.co.com/20npJrmK/story4.jpg", // Replace with your image URLs
      authorName: "Joey Brown",
      authorImage:
        "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg", // Replace with your image URLs
    },
    {
      id: 5,
      image: "https://i.ibb.co.com/20npJrmK/story4.jpg", // Replace with your image URLs
      authorName: "Joey Brown",
      authorImage:
        "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg", // Replace with your image URLs
    },
    {
      id: 6,
      image: "https://i.ibb.co.com/20npJrmK/story4.jpg", // Replace with your image URLs
      authorName: "Joey Brown",
      authorImage:
        "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg", // Replace with your image URLs
    },
  ];

  return (
    <section className="w-full">
      <Swiper
        slidesPerView={5}
        spaceBetween={16}
        freeMode={true}
        pagination={{
          clickable: true,
          el: null,
        }}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
        {/* Add Journey Card */}
        <SwiperSlide>
          <div className="relative w-full h-[250px] rounded-lg overflow-hidden shadow-lg cursor-pointer">
            <Image
              src="https://i.ibb.co.com/DP5pMfK8/story5.jpg"
              alt="Story Image"
              width={200}
              height={380}
              className="object-cover w-full h-full rounded-lg"
            />
             <div className="absolute p-4 rounded-lg top-0 left-0 right-0 bottom-0 bg-white/30 flex flex-col justify-end ">
              <div className="flex flex-col items-center gap-5">
                <div className="size-10 bg-white flex justify-center items-center rounded-2xl">
                  <Plus  size={20} className="text-gray-950  font-bold"/>
                </div>
                <h1 className="text-white text-sm font-semibold">Add Journey</h1>
              </div>
             </div>
          </div>
        </SwiperSlide>

        {/* Story Cards */}
        {storyData.map((story) => (
          <SwiperSlide key={story.id}>
            <StoryCard
              image={story.image}
              authorName={story.authorName}
              authorImage={story.authorImage}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Stories;
