"use client";
import React, { useState, useEffect } from "react";
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
import MyUpComingTourSkeleton from "../../UserProfilePage/MyInvitationsPage/MyUpComingTours/MyUpComingTourSkeleton";

const Invitations: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allInvitations, setAllInvitations] = useState<IEventInvitation[]>([]); // Store all invitations

  const { data: responseData, isLoading: isFetching } = useGetMyInvitesQuery(
    [
      { key: "page", value: currentPage },
      { key: "limit", value: 6 },
    ],
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const totalPages = responseData?.data?.attributes?.totalPages || 1;
  const invitationCount = responseData?.data?.attributes?.invitationCount || 0;

  // update allInvitations when user accepect the invitation
  const handleAcceptInvitation = (invitationId: string) => {
    setAllInvitations((prevInvitations) =>
      prevInvitations.filter((invitation) => invitation._id !== invitationId)
    );
  };

  // Append new invitations to allInvitations, avoiding duplicates
  useEffect(() => {
    const newInvitations = responseData?.data?.attributes?.results || [];
    if (newInvitations.length > 0) {
      setAllInvitations((prevInvitations) => {
        // Filter out duplicates based on event._id
        const existingIds = new Set(
          prevInvitations.map((invitation) => invitation._id)
        );
        const uniqueNewInvitations = newInvitations.filter(
          (invitation: IEventInvitation) => !existingIds.has(invitation._id)
        );
        return [...prevInvitations, ...uniqueNewInvitations];
      });
    }
  }, [responseData]); // Depend on responseData directly

  // Handle slide change to increment page
  const handleReachEnd = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else {
      // Reset to page 1 for infinite loop
      setCurrentPage(1);
      // Optional: Clear invitations to restart (if desired)
      // setAllInvitations([]);
    }
  };

  let content = null;
  if (isFetching && allInvitations.length === 0) {
    content = (
      <SwiperSlide>
        <MyUpComingTourSkeleton />
      </SwiperSlide>
    );
  } else if (allInvitations?.length === 0) {
    content = <p className="text-xl">No events found</p>;
  } else {
    content = allInvitations?.map((event: IEventInvitation) => (
      <SwiperSlide key={event?._id}>
        <InvitationCard event={event} handleAcceptInvitation={handleAcceptInvitation} />
      </SwiperSlide>
    ));
  }

  return (
    <section className="w-full">
      {allInvitations?.length > 0 || isFetching ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold uppercase">Invitations</h1>
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
              <span>{invitationCount}</span>
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
            onReachEnd={handleReachEnd}
          >
            {content}
          </Swiper>
        </>
      ) : null}
    </section>
  );
};

export default Invitations;
