"use client";
import { useGetSinglePostQuery } from "@/redux/features/post/postApi";
import { useParams } from "next/navigation";
import PostCard from "../posts/post-card";

const FeedDetails = () => {
  const { feedId } = useParams();
  const { data: responseData } = useGetSinglePostQuery(feedId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: !feedId,
  });
  const feedDetailsData = responseData?.data?.attributes;
  return (
    <section className="w-full">
      {feedDetailsData && <PostCard post={feedDetailsData} />}
    </section>
  );
};

export default FeedDetails;
