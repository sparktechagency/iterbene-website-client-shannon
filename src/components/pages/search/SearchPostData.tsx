import React from "react";
import SearchPostDataCard from "./SearchPostDataCard";
import { ISearchPost } from "@/types/search.types";

const SearchPostData = ({
  postsData,
  hasMore,
}: {
  postsData: ISearchPost[];
  hasMore: boolean;
}) => {
  if (!postsData?.length) {
    return (
      <section className="w-full bg-white rounded-xl p-8 text-center">
        <h1 className="text-xl font-semibold text-gray-600">No posts available</h1>
      </section>
    );
  }

  return (
    <section className="w-full bg-white rounded-xl p-8">
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
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-9 mt-6">
        {postsData.map((post, index) => (
          <SearchPostDataCard key={index} post={post} />
        ))}
      </div>
    </section>
  );
};

export default SearchPostData;