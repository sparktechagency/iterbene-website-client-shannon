import React from "react";
import UpcomingEventCard from "./upComing-event-card";
interface IAuthor {
  fullName: string;
  profileImage: {
    imageUrl: string;
  };
}

interface IEvent {
  id: number;
  title: string;
  author: IAuthor;
  image: {
    imageUrl: string;
  };
  members: string;
}
const upComingEvent: IEvent[] = [
  {
    id: 1,
    title: "Holiday trip to Barcelona Spain",
    author: {
      fullName: "John Doe",
      profileImage: {
        imageUrl:
          "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg",
      },
    },
    image: {
      imageUrl:
        "https://i.ibb.co.com/6RknjBzS/35b873adc5c444a2d66ee10e62d473d6.jpg",
    },
    members: "1.1K",
  },
  {
    id: 2,
    title: "Holiday trip to Barcelona Spain",
    author: {
      fullName: "John Doe",
      profileImage: {
        imageUrl:
          "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg",
      },
    },
    image: {
      imageUrl:
        "https://i.ibb.co.com/hFVGYMF0/2588a7b47b42d6dddfdfa08bb9300d00.jpg",
    },
    members: "1.1K",
  },
  {
    id: 3,
    title: "Holiday trip to Barcelona Spain",
    author: {
      fullName: "John Doe",
      profileImage: {
        imageUrl:
          "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg",
      },
    },
    image: {
      imageUrl:
        "https://i.ibb.co.com/JVfh3WK/36fe2823b98504660e2f44dc3c1ffb97.jpg",
    },
    members: "1.1K",
  }
];
const UpcomingEvents = () => {
  return (
    <section className="w-full pt-2 pb-7 border-b border-gray-300">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
        Upcoming Tour
        </h1>
        <button className="text-primary hover:underline">Show more</button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {upComingEvent.map((event) => (
          <UpcomingEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
};

export default UpcomingEvents;
