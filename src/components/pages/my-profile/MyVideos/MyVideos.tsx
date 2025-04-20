"use client";

import { ChevronDown } from "lucide-react";
import VideoCard from "../../user-profile/user-video-tab/video-card";

const MyVideos = () => {
  // Sample video URLs and placeholder thumbnails (replace with your actual video URLs and thumbnails)
  const videos = [
    {
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  ];

  return (
    <div className="w-full bg-white p-5 rounded-2xl">
      {/* Header with Title and Edit Button */}
      <div className="flex justify-between mb-4 border-b border-[#B5B7C5] pb-5">
        <h2 className="text-lg font-semibold text-gray-800">Videos</h2>
        <div className="px-4 py-2.5 border border-[#B5B7C5] rounded-xl font-semibold text-sm flex items-center gap-2 text-gray-900">
          <span className="font-medium">Recently</span>
          <ChevronDown size={24} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {videos.map((video, index) => (
          <VideoCard key={index} url={video.url} />
        ))}
      </div>
    </div>
  );
};

export default MyVideos;
