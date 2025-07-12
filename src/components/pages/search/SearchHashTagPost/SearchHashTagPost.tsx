"use client";

import { useGetHashtagPostsQuery } from "@/redux/features/hashtag/hashtagApi";
import { useSearchParams } from "next/navigation";

const SearchHashTagPost = () => {
  const hashtag = useSearchParams().get("q");
  const { data: responseData } = useGetHashtagPostsQuery(hashtag, {
    refetchOnMountOrArgChange: true,
    skip: !hashtag,
  });

  console.log("Response Data:", responseData);
  return <div>SearchHashTagPost</div>;
};

export default SearchHashTagPost;
