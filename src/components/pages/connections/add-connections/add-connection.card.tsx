import Image from "next/image";
import React from "react";

// Define the TypeScript interface for the card props
interface AddConnectionCardProps {
  image: string;
  name: string;
}

const AddConnectionCard: React.FC<AddConnectionCardProps> = ({
  image,
  name,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
      {/* Profile Image */}
      <Image
        src={image}
        alt={name}
        width={248}
        height={248}
        className="w-full h-full object-cover rounded-2xl mb-4"
      />
      {/* Name */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{name}</h2>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button className="bg-[#FEEFE8] hover:bg-secondary text-secondary hover:text-white  px-5 py-3.5 rounded-xl border border-secondary transition cursor-pointer">
          Add Connection
        </button>
        <button className="border border-[#9EA1B3] text-gray-900 px-5 py-3.5   rounded-xl hover:bg-gray-100 transition cursor-pointer">
          Remove
        </button>
      </div>
    </div>
  );
};

export default AddConnectionCard;
