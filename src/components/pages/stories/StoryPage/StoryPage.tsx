"use client";
import {
  useGetStoryQuery,
  useReactToStoryMutation,
  useReplyToStoryMutation,
  useViewStoryMutation,
} from "@/redux/features/stories/storiesApi";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const StoryPage = () => {
  const { stroyId } = useParams();
  const { data: responseData } = useGetStoryQuery(stroyId, {
    refetchOnMountOrArgChange: true,
    skip: !stroyId,
  });
  const [viewStory] = useViewStoryMutation();
  const [reactToStory] = useReactToStoryMutation();
  const [replyToStory] = useReplyToStoryMutation();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [reaction, setReaction] = useState("");
  const [reply, setReply] = useState("");
  const story = responseData?.data?.attributes;
  const handleNextMedia = () => {
    if (currentMediaIndex < story.mediaIds.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    } else {
      router.push("/"); // Go back to feed
    }
  };

  const handlePrevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    } else {
      router.push("/"); // Go back to feed
    }
  };

  const handleReact = async () => {
    try {
      await reactToStory({
        storyId: id as string,
        reactionType: reaction || "LIKE",
      }).unwrap();
    } catch (error) {
      console.error("Error reacting to story:", error);
    }
  };

  const handleReply = async () => {
    try {
      await replyToStory({ storyId: id as string, message: reply }).unwrap();
      setReply("");
    } catch (error) {
      console.error("Error replying to story:", error);
    }
  };
  const media = story?.mediaIds[currentMediaIndex];
  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      <div className="relative w-full h-full max-w-2xl">
        {media?.mediaType === "image" ? (
          <Image
            src={media?.mediaUrl}
            alt="Story"
            fill
            className="object-contain"
          />
        ) : media?.mediaType === "video" ? (
          <video
            src={media?.mediaUrl}
            autoPlay
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-white text-center">{media?.textContent}</div>
        )}
        <button
          onClick={handlePrevMedia}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 p-2 rounded-full text-white"
        >
          ←
        </button>
        <button
          onClick={handleNextMedia}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 p-2 rounded-full text-white"
        >
          →
        </button>
        <div className="absolute top-4 left-4 right-4 flex justify-between text-white">
          <div className="flex items-center">
            <Image
              src={story?.userId?.profileImage}
              alt={story?.userId?.fullName}
              width={32}
              height={32}
              className="rounded-full mr-2"
            />
            <span>{story?.userId?.fullName}</span>
          </div>
          <span>
            {currentMediaIndex + 1}/{story?.mediaIds?.length}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={handleReact} className="flex items-center gap-1">
              <Heart size={24} />
              <span>{story?.reactions?.length}</span>
            </button>
            <button className="flex items-center gap-1">
              <MessageCircle size={24} />
              <span>{story?.replies?.length}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply to story..."
              className="flex-1 p-2 rounded-full bg-white/20 text-white placeholder-white/50"
            />
            <button
              onClick={handleReply}
              className="bg-blue-500 text-white p-2 rounded-full"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;
