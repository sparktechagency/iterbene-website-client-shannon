"use client";
import React, { useState } from "react";
import { FaCalendarCheck, FaHeart } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import { IPost } from "@/types/post.types";
import CustomModal from "@/components/custom/custom-modal";
import { Bookmark, Download } from "lucide-react";
import { IoClose } from "react-icons/io5";
import ItineraryHeader from "./ItineraryHeader";

interface UserTimelineCardProps {
  post: IPost;
}

const ItineraryCard: React.FC<UserTimelineCardProps> = ({ post }) => {
  const sortedReactions = Object.entries(post?.reactions)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample itinerary data (you can replace this with actual data from post.document)
  const itineraryData = {
    title: "Flight to Italy",
    details: "September 4th Delta Departure: 3:30 AM Arrival: 6:30 PM",
    rating: 4,
    days: [
      {
        day: "Day 1: Arrive in Milan",
        activities: [
          {
            time: "7:00 PM",
            title: "Car Pick-up",
            description: "Pick up from my location, take me to the hotel.",
            link: "Link",
            rating: 4,
          },
          {
            time: "7:30 PM",
            title: "Check in Hotel: Melia Milano",
            description:
              "Check in 7:30 PM - left 10:10 PM. Have a good sleep with good environment.",
            link: "Link",
            rating: 5,
          },
        ],
      },
      {
        day: "Day 2: Milan to Varennna",
        activities: [
          {
            time: "12:00 PM",
            title: "Hotel Villa Cipressi",
            description: "Pick up from my location, take me to the hotel.",
            link: "Link",
            rating: 5,
          },
          {
            time: "2:30 PM",
            title: "Lunch",
            description: "Have a good lunch at La Caneva Bistro.",
            link: "Link",
            rating: 4,
          },
        ],
      },
    ],
  };

  return (
    <div className="w-full bg-white rounded-xl p-4 mb-4">
      <ItineraryHeader post={post} />
      <p className="text-gray-700 mb-4">{post.content.text}</p>

      {/* Document/Itinerary Section */}
      <div
        className="w-full bg-[#E6F5FA] rounded-lg p-4 mb-4 cursor-pointer"
        onClick={() => setIsModalOpen(true)} // Open modal on click
      >
        <p className="text-primary font-semibold">
          itineraryData.title March 12
        </p>
      </div>

      <div className="flex gap-7 items-center mt-5 border-b border-[#000000] pt-8 pb-5">
        <div className="relative flex items-center">
          <button className="text-gray-600 flex gap-2 items-center cursor-pointer">
            <FaHeart className="size-6 text-primary" />
            {sortedReactions.length > 0
              ? sortedReactions[0][0].charAt(0).toUpperCase() +
                sortedReactions[0][0].slice(1)
              : ""}
          </button>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <RiMessage2Fill className="size-6 text-primary" />
          <span className="font-semibold">{post?.comments?.length}</span>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <FaCalendarCheck className="h-5 w-5 text-primary" />
          <span className="font-semibold">{post.shares}</span>
        </div>
      </div>
      <CustomModal
        maxWidth="max-w-5xl"
        header={
          <div className="flex items-center justify-between p-6 border-b border-gray-200 rounded-t-xl">
            <div className="flex gap-4 items-center">
              <button className="size-12 rounded-full border border-[#9194A9] bg-[#EEFDFB] flex justify-center items-center">
                <Bookmark size={22} />
              </button>
              <button className="size-12 rounded-full border border-[#9194A9] bg-[#EEFDFB] flex justify-center items-center">
                <Download size={22} />
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="size-12 rounded-full border cursor-pointer border-[#9194A9] bg-[#EEFDFB] flex justify-center items-center"
            >
              <IoClose size={22} />
            </button>
          </div>
        }
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div>
          {/* Itinerary Header */}
          <h2 className="text-lg font-semibold text-primary mb-2">
            {itineraryData.title}
          </h2>
          <p className="text-gray-600 mb-2">{itineraryData.details}</p>
          <div className="flex items-center mb-4">
            <span className="text-gray-600">Rate: </span>
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < itineraryData.rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.314 9.397c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
              </svg>
            ))}
          </div>
          <hr className="border-gray-300 mb-4" />

          {/* Itinerary Days */}
          {itineraryData.days.map((day, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                {day.day}
              </h3>
              {day.activities.map((activity, idx) => (
                <div key={idx} className="mb-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">{activity.time}</span> -{" "}
                    {activity.title}
                  </p>
                  <p className="text-gray-600">{activity.description}</p>
                  <a
                    href={activity.link}
                    className="text-primary underline text-sm"
                  >
                    {activity.link}
                  </a>
                  <div className="flex items-center mt-1">
                    <span className="text-gray-600 text-sm">Rate: </span>
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < activity.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.838-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.314 9.397c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CustomModal>
    </div>
  );
};

export default ItineraryCard;
