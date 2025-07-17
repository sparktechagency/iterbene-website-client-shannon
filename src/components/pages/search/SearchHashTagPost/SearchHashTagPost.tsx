"use client";

import { useGetHashtagPostsQuery } from "@/redux/features/hashtag/hashtagApi";
import { useSearchParams } from "next/navigation";
import PostCard from "../../home/posts/post-card";
import { IPost } from "@/types/post.types";
import { Suspense } from "react";
import Skeleton from "@/components/custom/custom-skeleton";
import PostCardSkeleton from "../../home/posts/PostCardSkeleton";
import { Loader2 } from "lucide-react";

const SearchHashTagPostContent = () => {
  const hashtag = useSearchParams().get("q");
  const { data: responseData, isLoading } = useGetHashtagPostsQuery(hashtag, {
    refetchOnMountOrArgChange: true,
    skip: !hashtag,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="space-y-2">
            <Skeleton width="40%" height="12px" className="rounded" />
            <div className="flex items-center space-x-2">
              <Skeleton width="10%" height="12px" className="rounded" />
              <Skeleton width="10%" height="12px" className="rounded" />
            </div>

            <div className="space-y-4 mt-10">
              {[1, 2, 3].map((i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hashtag) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700">Please enter a hashtag to search.</p>
          </div>
        </div>
      </div>
    );
  }

  console.log("Response Data:", responseData?.data?.attributes?.results);

  const posts = responseData?.data?.attributes?.results[0]?.posts || [];
  const postCount = responseData?.data?.attributes?.results[0]?.postCount || 0;

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">#{hashtag}</h1>
          <p className="text-gray-600">
            {postCount} {postCount === 1 ? "post" : "posts"} found
          </p>
        </div>

        {/* Posts */}
        {posts?.length > 0 ? (
          <div className="space-y-4">
            {posts?.map((post: IPost) => (
              <PostCard key={post?._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-500 mb-4">
              <svg
                className="w-12 h-12 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600">
              There are no posts with the hashtag #{hashtag} yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const SearchHashTagPost = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      }
    >
      <SearchHashTagPostContent />
    </Suspense>
  );
};

export default SearchHashTagPost;
