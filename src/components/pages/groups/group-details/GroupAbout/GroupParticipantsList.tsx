import Image from "next/image";
import React from "react";

// Sample list of random user names
const participants = [
  "Alice Johnson",
  "Michael Chen",
  "Sophie Davis",
  "Rahul Sharma",
  "Emily Watson",
];

const GroupParticipantsList = () => {
  return (
    <div className="w-full col-span-full md:col-span-5 bg-white p-6 md:p-9 rounded-xl">
      {/* Heading and "Show more" link */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Participants
        </h2>
        <a
          href="#"
          className="text-primary text-sm md:text-base font-medium"
        >
          Show more
        </a>
      </div>

      {/* Participants list */}
      <ul className="space-y-4">
        {participants.slice(0, 4).map((participant, index) => (
          <li key={index} className="flex items-center space-x-4">
            {/* Random user avatar using DiceBear */}
            <Image
              src={`https://randomuser.me/api/portraits/women/${index}.jpg`}
              alt={participant}
              width={48}
              height={48}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
            />
            {/* Participant name */}
            <span className="text-base md:text-lg text-gray-900 font-medium">
              {participant}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupParticipantsList;