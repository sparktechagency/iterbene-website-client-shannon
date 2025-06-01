"use client";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
import { useParams } from "next/navigation";
import UserIteItineraryCard from "./UserIteItineraryCard";

const UserIteItinerary = () => {
  const { userName } = useParams();
  const { data: responseData } = useGetUserTimelinePostsQuery(
    {
      username: userName,
      filters: [
        {
          key: "mediaType",
          value: "itinerary",
        },
      ],
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !userName,
    }
  );
  const userItineraryData = responseData?.data?.attributes?.results;
  return     <section className="w-full space-y-3 rounded-2xl">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {
          userItineraryData?.map((post: IPost) => (
            <UserIteItineraryCard key={post?._id} post={post} />
          ))
        }
      </div>
    </section>
};

export default UserIteItinerary;
