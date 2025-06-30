"use client";
import { useFeedPostsQuery } from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
import PostCard from "../home/posts/post-card";

const PhotosPage = () => {
  const { data: responseData } = useFeedPostsQuery(
    [{ key: "mediaType", value: "image" }],
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const photosData = responseData?.data?.attributes?.results;
  // const totalResults = responseData?.data?.attributes?.totalResults;

  return (
    <section className="w-full">
      {photosData?.map((post: IPost) => (
        <PostCard key={post._id} post={post} />
      ))}
    </section>
  );
};

export default PhotosPage;
