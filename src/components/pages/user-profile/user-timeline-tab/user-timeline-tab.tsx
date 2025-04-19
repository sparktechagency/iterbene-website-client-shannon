'use client';
import { IPost } from "@/types/post.types";
import React from "react";
import UserTimelineCard from "./user-timeline-card";

const UserTimelineTab = () => {
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
          {
            type: "photo",
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
          },
          { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
          {
            type: "photo",
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
          },
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
      username: "Sarah Miller",
      profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
      timestamp: "2 days ago",
      location: "New York, USA",
      content: {
        text: "Exploring the city that never sleeps! The energy here is unreal.",
        media: [
          {
            type: "photo",
            url: "https://i.ibb.co.com/YDBLTZF/Street.jpg",
          },
          {
            type: "video",
            url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          },
        ],
      },
      reactions: { love: 85, luggage: 25, ban: 10, smile: 12 },
      comments: [
        {
          id: "c2",
          username: "Mike Johnson",
          profilePic: "https://randomuser.me/api/portraits/men/2.jpg",
          text: "Looks like a blast! Did you visit Times Square?",
          timestamp: "1 day ago",
          replies: [
            {
              id: "r2",
              username: "Sarah Miller",
              profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
              text: "Yes, it was chaotic but so much fun!",
              timestamp: "20 hours ago",
            },
          ],
        },
      ],
      shares: 8,
    },
    {
      id: "4",
      username: "Liam Patel",
      profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
      timestamp: "5 hours ago",
      location: "Tokyo, Japan",
      content: {
        text: "Lost in the neon jungle of Tokyo. Can't get enough of this place!",
        media: [
          {
            type: "photo",
            url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop",
          },
        ],
      },
      reactions: { love: 120, luggage: 45, ban: 8, smile: 20 },
      comments: [
        {
          id: "c3",
          username: "Emma Chen",
          profilePic: "https://randomuser.me/api/portraits/women/3.jpg",
          text: "Tokyo is on my list! How’s the food?",
          timestamp: "4 hours ago",
          replies: [],
        },
      ],
      shares: 15,
    },
    {
      id: "5",
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
          {
            type: "photo",
            url: "https://i.ibb.co.com/zhGDQ7Q/blog-6.jpg",
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
    <section className="w-full space-y-3rounded-2xl">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {demoPosts?.map((post) => (
          <UserTimelineCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default UserTimelineTab;
