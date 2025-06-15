"use client";
import { VideoContextProvider } from "@/context/VideoContext";
import { useFeedPostsQuery } from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
import PostCard from "./post-card";
import PostCardWrapper from "./PostCardWrapper";

const Posts = () => {
  const {
    data: responseData,
    isLoading,
    isError,
  } = useFeedPostsQuery(undefined);
  const postsData = responseData?.data?.attributes?.results as
    | IPost[]
    | undefined;

  if (isLoading) {
    return <div className="w-full text-center py-4">Loading posts...</div>;
  }

  if (isError) {
    return (
      <div className="w-full text-center py-4 text-red-500">
        Failed to load posts.
      </div>
    );
  }

  if (!postsData || postsData.length === 0) {
    return <div className="w-full text-center py-4">No posts available.</div>;
  }

  return (
    <VideoContextProvider>
      <section className="w-full space-y-4">
        {postsData.map((post: IPost) => (
          <PostCardWrapper key={post._id} post={post}>
            <PostCard post={post} />
          </PostCardWrapper>
        ))}
      </section>
    </VideoContextProvider>
  );
};

export default Posts;
