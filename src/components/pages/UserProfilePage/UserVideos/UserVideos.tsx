"use client";
import { useParams } from "next/navigation";
import VideoCard from "./VideoCard";
import { useGetUserTimelinePostsQuery } from "@/redux/features/post/postApi";
import { IPost } from "@/types/post.types";
const UserVideos = () => {
  const { userName } = useParams();
  const { data: responseData } = useGetUserTimelinePostsQuery(
    {
      username: userName,
      filters: [
        {
          key: "mediaType",
          value: "video",
        },
      ],
    },
    { refetchOnMountOrArgChange: true, skip: !userName }
  );
  const userTimelineVideoData = responseData?.data?.attributes?.results;
  return (
    <div className="w-full bg-white p-5 rounded-2xl">
      {/* Header with Title and Edit Button */}
      <div className="flex justify-between mb-4 border-b border-[#B5B7C5] pb-4">
        <h2 className="text-lg font-semibold text-gray-800">Videos</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {userTimelineVideoData?.map((video: IPost, index: number) =>
          video.media?.map((media) => {
            return <VideoCard key={index} url={media?.mediaUrl} />;
          })
        )}
      </div>
    </div>
  );
};

export default UserVideos;
