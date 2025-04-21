import Image from "next/image";
import Link from "next/link";
import React from "react";

// Define the TypeScript interface for the card props
interface RequestedConnectionCardProps {
  image: string;
  name: string;
}

const RequestedConnectionCard: React.FC<RequestedConnectionCardProps> = ({
  image,
  name,
}) => {
  return (

    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
      {/* Profile Image */}
      <Link href={`/user-info/${name}`} className="w-full block">
        <Image
          src={image}
          alt={name}
          width={248}
          height={248}
          className="w-full h-full object-cover rounded-2xl mb-4"
        />
      </Link>
      {/* Name */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{name}</h2>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full">
        <button className="bg-secondary text-white px-5 py-3 rounded-xl cursor-pointer">
          Accept
        </button>
        <button className="border border-[#9EA1B3] text-gray-900 px-5 py-3  rounded-xl  hover:bg-gray-100 transition cursor-pointer">
          Decline
        </button>
      </div>
    </div>

  );
};

export default RequestedConnectionCard;
