"use client";
import CreatePost from "@/components/pages/home/create-post/create-post";
import Journeys from "@/components/pages/home/journeys/journeys";
import Posts from "@/components/pages/home/posts/posts";

const Feed = () => {
  return (
    <section className="w-full h-full  space-y-5 md:space-y-8 overflow-y-auto z-50 flex-1 flex flex-col">
      <Journeys />
      <CreatePost postType="User" />
      <div className="flex-1">
        <Posts />
      </div>
    </section>
  );
};

export default Feed;
