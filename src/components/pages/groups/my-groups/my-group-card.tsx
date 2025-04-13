import Image from "next/image";
import React from "react";
import {PiUserBold } from "react-icons/pi";

// Define the TypeScript interface for the card props
interface MyGroupCardProps {
  image: string;
  name: string;
  members: string;
}

const MyGroupCard: React.FC<MyGroupCardProps> = ({ image, name, members }) => {
  return (
    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
      {/* Group Image */}
      <div className="w-full h-[350px] bg-gray-200 rounded-xl mb-4 relative">
        <Image
          src={image}
          alt={name}
          width={350}
          height={350}
          className="w-full h-full object-cover rounded-2xl mb-4"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-950/20 rounded-xl"></div>
        {/* Member Count Overlay */}
        <div className="absolute top-5 right-5 bg-white rounded-full px-4 py-2 flex items-center gap-1">
         <PiUserBold size={24} className="text-secondary" />
          <span className="text-sm font-semibold text-gray-800">{members}</span>
        </div>
        {/* Group Name */}
        <h2 className="text-2xl md:text-[32px] font-bold text-white absolute bottom-4 left-2">
          {name}
        </h2>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button className="bg-secondary hover:bg-[#FEEFE8] hover:text-secondary text-white  px-5 py-3.5 rounded-lg border border-secondary transition cursor-pointer">
          View
        </button>
        <button className="border border-[#9EA1B3] text-gray-900 px-5 py-3.5   rounded-lg hover:bg-gray-100 transition cursor-pointer">
          Remove
        </button>
      </div>
    </div>
  );
};

export default MyGroupCard;
