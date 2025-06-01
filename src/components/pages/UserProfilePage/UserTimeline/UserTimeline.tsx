'use client';
import { IPost } from "@/types/post.types";
import React from "react";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useParams } from "next/navigation";
import UserTimelineCard from "./UserTimelineCard";
const UserTimeline = () => {
  const {userName} = useParams();
  const { data: responseData } = useGetUserTimelinePostsQuery({
    username: userName
  }, {
    refetchOnMountOrArgChange: true,
    skip: !userName,
  });
  const userTimelineData = responseData?.data?.attributes?.results;
  return (
    <section className="w-full space-y-3 rounded-2xl">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {
          userTimelineData?.map((post: IPost) => (
            <UserTimelineCard key={post?._id} post={post} />
          ))
        }
      </div>
    </section>
  );
};

export default UserTimeline;
