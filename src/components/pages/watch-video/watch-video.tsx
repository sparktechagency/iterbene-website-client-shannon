import { IPost } from "@/types/post.types";
import React from "react";
import PostCard from "../home/posts/post-card";

const WatchVideo = () => {
  const demoPosts: IPost[] = [
    {
      id: "1",
      username: "Alexandra Brooke",
      profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
      timestamp: "12 hours ago",
      location: "Rome, Italy",
      content: {
        text: "This was one of the most epic journeys, that I've got myself involved in. Maybe one of the most memorable in MY entire life!",
        media: [
          { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
        ],
      },
      reactions: { love: 100, luggage: 30, ban: 15, smile: 5 },
      comments: [
        {
          id: "c1",
          username: "John Doe",
          profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
          text: "Wow, this looks amazing!",
          timestamp: "10 hours ago",
          replies: [
            {
              id: "r1",
              username: "Alexandra Brooke",
              profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
              text: "Thanks, John! It really was an incredible experience.",
              timestamp: "9 hours ago",
            },
          ],
        },
      ],
      shares: 5,
    },
    {
      id: "2",
      username: "John Doe",
      profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
      timestamp: "1 day ago",
      content: {
        text: "Just a chill day at the beach!",
        media: [
          { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
        ],
      },
      reactions: { love: 50, luggage: 20, ban: 5, smile: 3 },
      comments: [],
      shares: 2,
    },
    {
      id: "3",
      username: "Olivia Green",
      profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
      timestamp: "3 days ago",
      location: "Sydney, Australia",
      content: {
        text: "Sunset at the Opera House was breathtaking. Australia, you’ve stolen my heart!",
        media: [
          {
            type: "video",
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
          },
        ],
      },
      reactions: { love: 95, luggage: 35, ban: 7, smile: 18 },
      comments: [
        {
          id: "c4",
          username: "James Carter",
          profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
          text: "Stunning view! Did you climb the bridge?",
          timestamp: "2 days ago",
          replies: [
            {
              id: "r3",
              username: "Olivia Green",
              profilePic: "https://randomuser.me/api/portraits/women/4.jpg",
              text: "Not this time, but it’s on my list for next visit!",
              timestamp: "1 day ago",
            },
          ],
        },
      ],
      shares: 10,
    },
  ];
  return (
    <section className="w-full">
      {demoPosts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
};

export default WatchVideo;
