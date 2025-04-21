import { IPost } from "@/types/post.types";
import React from "react";
import PostCard from "../home/posts/post-card";

const Photos = () => {
  const demoPosts: IPost[] = [
    {
      id: "1",
      username: "Emma Watson",
      profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
      timestamp: "12 hours ago",
      location: "Rome, Italy",
      content: {
        text: "This was one of the most epic journeys, that I've got myself involved in. Maybe one of the most memorable in MY entire life!",
        media: [
          {
            type: "photo",
            url: "https://i.ibb.co.com/TBFhZcsc/post1.jpg",
          },
          {
            type: "photo",
            url: "https://i.ibb.co.com/Z6792YGV/post2.jpg",
          },
          {
            type: "photo",
            url: "https://i.ibb.co.com/Zyy6bvr/post3.jpg",
          },
        ],
      },
      reactions: { love: 100, luggage: 30, ban: 15, smile: 5 },
      comments: [
        {
          id: "c1",
          username: "Michael Brown",
          profilePic: "https://randomuser.me/api/portraits/men/5.jpg",
          text: "Wow, this looks amazing!",
          timestamp: "10 hours ago",
          replies: [
            {
              id: "r1",
              username: "Emma Watson",
              profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
              text: "Thanks, Michael! It really was an incredible experience.",
              timestamp: "9 hours ago",
            },
          ],
        },
      ],
      shares: 5,
    },
    {
      id: "2",
      username: "Sophie Turner",
      profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
      timestamp: "2 days ago",
      location: "New York, USA",
      content: {
        text: "Exploring the city that never sleeps! The energy here is unreal.",
        media: [
          {
            type: "photo",
            url: "https://i.ibb.co.com/TBFhZcsc/post1.jpg",
          },
          {
            type: "photo",
            url: "https://i.ibb.co.com/Z6792YGV/post2.jpg",
          },
          {
            type: "photo",
            url: "https://i.ibb.co.com/Zyy6bvr/post3.jpg",
          },
          {
            type: "photo",
            url: "https://i.ibb.co.com/YDBLTZF/Street.jpg",
          },
          {
            type: "photo",
            url: "https://i.ibb.co.com/YDBLTZF/Street.jpg",
          },
        ],
      },
      reactions: { love: 85, luggage: 25, ban: 10, smile: 12 },
      comments: [
        {
          id: "c2",
          username: "David Wilson",
          profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
          text: "Looks like a blast! Did you visit Times Square?",
          timestamp: "1 day ago",
          replies: [
            {
              id: "r2",
              username: "Sophie Turner",
              profilePic: "https://randomuser.me/api/portraits/women/6.jpg",
              text: "Yes, it was chaotic but so much fun!",
              timestamp: "20 hours ago",
            },
          ],
        },
      ],
      shares: 8,
    },
    {
      id: "3", // Changed ID to avoid duplicate
      username: "Noah Sharma",
      profilePic: "https://randomuser.me/api/portraits/men/7.jpg",
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
          username: "Lily Zhang",
          profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
          text: "Tokyo is on my list! How’s the food?",
          timestamp: "4 hours ago",
          replies: [],
        },
      ],
      shares: 15,
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

export default Photos;
