"use client";
import CreatePost from "@/components/pages/home/create-post/create-post";
import { useParams } from "next/navigation";
import React from "react";
import EventPost from "./EventPost";

const GroupDiscussion = () => {
  const { eventId } = useParams();

  return (
    <section className="w-full space-y-5">
      <CreatePost postType="Event" eventId={eventId as string} />
      <EventPost />
    </section>
  );
};

export default GroupDiscussion;
