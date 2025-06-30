"use client";
import { VideoContextProvider } from "@/context/VideoContext";
import { useFeedPostsQuery } from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
import PostCard from "./post-card";
import PostCardWrapper from "./PostCardWrapper";

const Posts = () => {
  const {
    data: responseData
  } = useFeedPostsQuery(undefined,{
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });
  const postsData = responseData?.data?.attributes?.results as
    | IPost[]
    | undefined;


  //   const [posts, setPosts] = useState(mockPosts)
  // const [loading, setLoading] = useState(false)

  // const loadMorePosts = () => {
  //   setLoading(true)
  //   setTimeout(() => {
  //     const newPosts = mockPosts.map((post) => ({
  //       ...post,
  //       id: post.id + posts.length,
  //     }))
  //     setPosts((prev) => [...prev, ...newPosts])
  //     setLoading(false)
  //   }, 1000)
  // }

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
  //       loading
  //     ) {
  //       return
  //     }
  //     loadMorePosts()
  //   }

  //   window.addEventListener("scroll", handleScroll)
  //   return () => window.removeEventListener("scroll", handleScroll)
  // }, [loading])


  return (
    <VideoContextProvider>
      <section className="w-full space-y-4">
        {postsData?.map((post: IPost) => (
          <PostCardWrapper key={post._id} post={post}>
            <PostCard post={post} />
          </PostCardWrapper>
        ))}
      </section>
    </VideoContextProvider>
  );
};

export default Posts;
