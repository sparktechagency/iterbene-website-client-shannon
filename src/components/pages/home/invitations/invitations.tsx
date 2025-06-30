"use client";
import React from "react";
import InvitationCard from "./invitation-card";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
// Import required modules
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { useGetMyInvitesQuery } from "@/redux/features/event/eventApi";
import { IEventInvitation } from "@/types/event.types";
const Invitations: React.FC = () => {
  const { data: responseData, isLoading } = useGetMyInvitesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const invitationsEvent = responseData?.data?.attributes?.results;
  const invitationCount = responseData?.data?.attributes?.invitationCount;
  let content = null;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (invitationsEvent?.length === 0) {
    content = <p className="text-xl">No events found</p>;
  } else if (invitationsEvent?.length > 0) {
    content = invitationsEvent?.map((event: IEventInvitation) => (
      <SwiperSlide key={event?._id}>
        <InvitationCard event={event} />
      </SwiperSlide>
    ));
  }
  return (
    <section className="w-full">
      {invitationsEvent?.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold uppercase">Invitations</h1>
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
              <span>{invitationCount || 0}</span>
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
            {content}
          </Swiper>
        </>
      )}
    </section>
  );
};

export default Invitations;
