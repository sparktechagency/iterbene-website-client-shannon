"use client";
import React, { useState, useEffect, useRef } from "react";
import SearchLocationData from "./SearchLocationData";
import SearchPostData from "./SearchPostData";
import { useSearchParams } from "next/navigation";
import { useGetSearchingLocationsPostsQuery } from "@/redux/features/search/searchApi";
import { Loader2 } from "lucide-react";
import { ISearchPost } from "@/types/search.types";

const PostsLocationsSearch = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allPosts, setAllPosts] = useState<ISearchPost[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const query = useSearchParams().get("q");
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetSearchingLocationsPostsQuery(
    { query, page: currentPage, limit: 10 },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      skip: !query,
    }
  );

  const postsLocationsDatas = responseData?.data?.attributes;
  const locationsData = postsLocationsDatas?.locations || [];
  const postsData = postsLocationsDatas?.posts || [];
  const totalPages = postsLocationsDatas?.totalPages || 1;

  // Update posts and hasMore state
  useEffect(() => {
    if (postsData && postsData.length > 0) {
      setAllPosts((prevPosts) => {
        const newPosts = postsData.filter(
          (newPost: ISearchPost) =>
            !prevPosts.some((post) => post._id === newPost._id)
        );
        return [...prevPosts, ...newPosts];
      });
    }
    if (totalPages && currentPage >= totalPages) {
      setHasMore(false);
    }
  }, [postsData, totalPages, currentPage]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching && !isLoading) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, isFetching, isLoading]);

  if (isLoading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  return (
    <section className="w-full space-y-5 md:space-y-8">
      <SearchLocationData locationsData={locationsData} hasMore={hasMore} />
      <SearchPostData postsData={allPosts} hasMore={hasMore} />
      {hasMore && (
        <div
          className="flex items-center justify-center py-4"
          ref={observerRef}
        >
          {isFetching && (
            <Loader2 className="animate-spin text-primary" size={28} />
          )}
        </div>
      )}
    </section>
  );
};

export default PostsLocationsSearch;
