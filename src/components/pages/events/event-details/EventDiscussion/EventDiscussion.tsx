"use client";
import CreatePost from "@/components/pages/home/create-post/create-post";
import { useParams } from "next/navigation";
import React from "react";
import EventPost from "./EventPost";
import { IEventDetails } from "@/types/event.types";
import EventSummary from "../EventAbout/EventSummary";
import EventParticipantsList from "../EventAbout/EventParticipantsList";

const GroupDiscussion = ({
  eventDetailsData,
}: {
  eventDetailsData: IEventDetails;
}) => {
  const { eventId } = useParams();

  return (
    <section className="w-full flex gap-5">
      <div className="w-full space-y-5">
        <CreatePost postType="Event" eventId={eventId as string} />
        <EventPost />
      </div>
      <div className="w-full hidden md:block max-w-[260px] md:max-w-[280px] xl:max-w-[320px] 2xl:max-w-[382px] space-y-5">
        <EventSummary eventDetailsData={eventDetailsData} />
        <EventParticipantsList eventDetailsData={eventDetailsData} />
      </div>
    </section>
  );
};

export default GroupDiscussion;
