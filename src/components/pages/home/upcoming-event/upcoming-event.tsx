"use client";
import UpcomingEventCard from "./upcoming-event-card";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// Import required modules
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { useGetSuggestionsEventsQuery } from "@/redux/features/event/eventApi";
import { useState, useEffect } from "react";
import { IEvent } from "@/types/event.types";
import MyUpComingTourSkeleton from "../../UserProfilePage/MyInvitationsPage/MyUpComingTours/MyUpComingTourSkeleton";

const UpcomingEvent = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allEvents, setAllEvents] = useState<IEvent[]>([]); // Store all events

  const { data: responseData, isFetching } = useGetSuggestionsEventsQuery(
    [
      { key: "page", value: currentPage },
      { key: "limit", value: 6 },
    ],
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );
  const totalPages = responseData?.data?.attributes?.totalPages || 1;

  // Append new events to allEvents, avoiding duplicates
  useEffect(() => {
    const newEvents = responseData?.data?.attributes?.results || [];
    if (newEvents.length > 0) {
      setAllEvents((prevEvents) => {
        // Filter out duplicates based on event._id
        const existingIds = new Set(prevEvents.map((event) => event._id));
        const uniqueNewEvents = newEvents.filter(
          (event: IEvent) => !existingIds.has(event._id)
        );
        return [...prevEvents, ...uniqueNewEvents];
      });
    }
  }, [responseData]); // Depend on responseData directly

  // Handle slide change to increment page
  const handleReachEnd = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else {
      // Optional: Reset to page 1 for infinite loop
      setCurrentPage(1);
      // Optional: Clear events to restart (if desired)
      // setAllEvents([]);
    }
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold uppercase">Upcoming</h1>
        <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
          <span>{allEvents.length}</span>
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
          el: null, // Disable default pagination bullets
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="mySwiper mt-5"
        onReachEnd={handleReachEnd}
      >
        {isFetching && allEvents.length === 0 ? (
          <SwiperSlide>
            <MyUpComingTourSkeleton />
          </SwiperSlide>
        ) : (
          allEvents.map((event: IEvent) => (
            <SwiperSlide key={event._id}>
              <UpcomingEventCard event={event} />
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </section>
  );
};

export default UpcomingEvent;
