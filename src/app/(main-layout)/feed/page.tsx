"use client";
import CreatePost from "@/components/pages/home/create-post/create-post";
import Posts from "@/components/pages/home/posts/posts";
import Stories from "@/components/pages/home/stories/stories";

const Feed = () => {
  return (
    <section className="w-full h-full space-y-5 md:space-y-8 overflow-y-auto z-50 flex-1 flex flex-col">
      <Stories />
      <CreatePost postType="User" />
      <div className="flex-1">
        <Posts />
      </div>
    </section>
  );
};

export default Feed;
