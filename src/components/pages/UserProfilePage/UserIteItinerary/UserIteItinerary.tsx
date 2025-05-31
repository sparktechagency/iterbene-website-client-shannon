"use client";

import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { useParams } from "next/navigation";

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
  const userItinerayData = responseData?.data?.attributes?.results;
  return <div>UserIteItinerary</div>;
};

export default UserIteItinerary;
