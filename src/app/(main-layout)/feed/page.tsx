"use client";
import CreatePost from "@/components/pages/home/create-post/create-post";
import Posts from "@/components/pages/home/posts/posts";
import Stories from "@/components/pages/home/stories/stories";

const Feed = () => {
  return (
    <section className="w-full space-y-5 md:space-y-8 overflow-y-auto">
      <Stories />
      <CreatePost postType="User" />
      <Posts />
    </section>
  );
};

export default Feed;
