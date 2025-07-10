"use client";
import PostCard from "@/components/pages/home/posts/post-card";
import { useGetGroupPostsQuery } from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import PostCardSkeleton from "@/components/pages/home/posts/PostCardSkeleton";

const GroupPost = () => {
  const { groupId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: responseData,
    isLoading,
    isError,
    refetch,
  } = useGetGroupPostsQuery(
    {
      groupId,
      filters: [
        { key: "page", value: currentPage },
        { key: "limit", value: 10 },
      ],
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      skip: !groupId,
    }
  );

  const currentPagePosts = useMemo(
    () =>
      Array.isArray(responseData?.data?.attributes?.results)
        ? (responseData.data.attributes.results as IPost[])
        : [],
    [responseData]
  );

  const totalPages = responseData?.data?.attributes?.totalPages;

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

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
      setHasMore(currentPage < (totalPages || 0));
    }
  }, [isLoading, currentPage, totalPages]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById("sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [loadMore, loading, hasMore]);

  if (isLoading && allPosts.length === 0) {
    return (
      <div className="space-y-4">
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full text-center py-4 text-red-500">
        Failed to load posts. Please try again.
        <button
          onClick={() => refetch()}
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (allPosts.length === 0) {
    return <div className="w-full text-center py-4">No posts available.</div>;
  }

  return (
    <div className="space-y-4">
      {allPosts?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {loading && (
        <div className="space-y-4">
          <PostCardSkeleton />
        </div>
      )}

      {hasMore && <div id="sentinel" style={{ height: "1px" }}></div>}
    </div>
  );
};

export default GroupPost;