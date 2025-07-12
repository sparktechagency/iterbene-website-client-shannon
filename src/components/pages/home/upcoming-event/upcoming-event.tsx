"use client";
import UpcomingEventCard from "./upcoming-event-card";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// import required modules
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { useGetSuggestionsEventsQuery } from "@/redux/features/event/eventApi";
import { useState } from "react";
import { IEvent } from "@/types/event.types";

const UpcomingEvent = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: responseData } = useGetSuggestionsEventsQuery(
    [
      {
        key: "page",
        value: currentPage,
      },
      {
        key: "limit",
        value: 6,
      },
    ],
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const upComingEvent = responseData?.data?.attributes?.results;

  console.log("Response Data:", responseData);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold uppercase">Upcoming</h1>
        <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
          <span>5</span>
        </div>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        freeMode={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: null,
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="mySwiper mt-5"
      >
        {upComingEvent?.map((event: IEvent) => (
          <SwiperSlide key={event._id}>
            <UpcomingEventCard event={event} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default UpcomingEvent;
