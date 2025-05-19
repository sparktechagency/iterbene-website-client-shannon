import { IPost } from "@/types/post.types";
import PostCard from "./post-card";
import { useFeedPostsQuery } from "@/redux/features/post/postApi";
const Posts = () => {
  const {data:responseData} = useFeedPostsQuery(undefined);
  const postsData = responseData?.data?.attributes?.results;
  // const totalResults = responseData?.data?.attributes?.totalResults;

  return (
    <section className="w-full">
      {postsData?.map((post: IPost) => (
        <PostCard key={post._id} post={post} />
      ))}
    </section>
  );
};

export default Posts;
