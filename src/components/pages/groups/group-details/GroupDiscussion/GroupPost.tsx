"use client";
import { useGetGroupPostsQuery } from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
import { useState, useEffect, useMemo, memo, Suspense } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useParams } from "next/navigation";
import PostCardSkeleton from "@/components/pages/home/posts/PostCardSkeleton";
import PostCard from "@/components/pages/home/posts/post-card";

const GroupPost = () => {
  const { groupId } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // API query parameters
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetGroupPostsQuery(
    {
      groupId,
      filters: [
        { key: "page", value: currentPage.toString() },
        { key: "limit", value: "10" },
      ],
    },
    {
      skip: !groupId,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  // Get current page posts from RTK Query cache
  const currentPagePosts = useMemo(
    () =>
      Array.isArray(responseData?.data?.attributes?.results)
        ? (responseData.data.attributes.results as IPost[])
        : [],
    [responseData]
  );

  // total number of pages
  const totalPages = responseData?.data?.attributes?.totalPages;

  // Merge new posts with existing posts
  useEffect(() => {
    if (currentPagePosts?.length > 0) {
      if (currentPage === 1) {
        setAllPosts(currentPagePosts);
      } else {
        setAllPosts((prevPosts) => {
          const existingIds = new Set(prevPosts?.map((post) => post?._id));
          const newPosts = currentPagePosts?.filter(
            (post) => !existingIds.has(post._id)
          );
          return [...prevPosts, ...newPosts];
        });
      }
    }
  }, [currentPagePosts, currentPage]);

  // Update existing posts
  useEffect(() => {
    if (currentPagePosts?.length > 0 && allPosts?.length > 0) {
      setAllPosts((prevPosts) => {
        return prevPosts?.map((existingPost) => {
          const updatedPost = currentPagePosts?.find(
            (p) => p?._id === existingPost?._id
          );
          return updatedPost || existingPost;
        });
      });
    }
  }, [allPosts?.length, currentPagePosts]);

  // Update loading state
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
      setHasMore(currentPage < (totalPages || 0));
    }
  }, [isLoading, currentPage, totalPages]);

  // Use the reusable infinite scroll hook
  const { lastElementRef } = useInfiniteScroll({
    isLoading,
    isFetching,
    hasMore: hasMore && !loading,
    onLoadMore: () => setCurrentPage((prev) => prev + 1),
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Render
  if (isLoading && allPosts?.length === 0) {
    return (
      <div className="w-full text-center py-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Render
  if (!isLoading && allPosts?.length === 0 && !hasMore) {
    return (
      <section className="w-full text-center py-4">
        <p className="text-gray-600 text-lg">No posts available</p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {allPosts?.map((post: IPost, index: number) => {
        if (index === allPosts?.length - 1) {
          return (
            <div key={post?._id} ref={lastElementRef}>
              <Suspense fallback={<PostCardSkeleton />}>
                <PostCard post={post} setAllPosts={setAllPosts} />
              </Suspense>
            </div>
          );
        }
        return (
          <Suspense key={post?._id} fallback={<PostCardSkeleton />}>
            <PostCard post={post} setAllPosts={setAllPosts} />
          </Suspense>
        );
      })}
      {isFetching && hasMore && (
        <div className="w-full text-center py-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <PostCardSkeleton key={`fetching-${index}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(GroupPost);
