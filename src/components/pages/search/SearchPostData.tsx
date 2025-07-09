import React from "react";
import SearchPostDataCard from "./SearchPostDataCard";
import { ISearchPost } from "@/types/search.types";
import SearchPostDataSkeleton from "./SearchPostDataSkeleton";

const SearchPostData = ({
  postsData,
  hasMore,
  isLoading,
  currentPage,
}: {
  postsData: ISearchPost[];
  hasMore: boolean;
  isLoading: boolean;
  currentPage: number;
}) => {
  let content = null;
  if (isLoading && currentPage === 1) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-9 mt-6">
        <SearchPostDataSkeleton />
        <SearchPostDataSkeleton />
        <SearchPostDataSkeleton />
        <SearchPostDataSkeleton />
        <SearchPostDataSkeleton />
        <SearchPostDataSkeleton />
      </div>
    );
  } else if (postsData?.length === 0) {
    return (
      <section className="w-full bg-white rounded-xl p-8 text-center">
        <h1 className="text-xl font-semibold text-gray-600">
          No posts available
        </h1>
      </section>
    );
  } else if (postsData?.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-9 mt-6">
        {postsData.map((post, index) => (
          <SearchPostDataCard key={index} post={post} />
        ))}
      </div>
    );
  }

  return (
    <section className="w-full bg-white rounded-xl p-8">
      {!isLoading && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">Post</h1>
            <span className="size-7 bg-primary flex justify-center items-center rounded-full text-white text-base">
              {postsData.length}
            </span>
          </div>
          {hasMore && (
            <button className="text-primary hover:underline cursor-pointer">
              Show More
            </button>
          )}
        </div>
      )}
      {content}
    </section>
  );
};

export default SearchPostData;
