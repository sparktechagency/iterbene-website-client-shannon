import { Ellipsis } from "lucide-react";
import Image from "next/image";
import React from "react";
interface Connection {
    name: string;
    image: string;
    isRequest: boolean
}
const MyConnectionCard = ({ connection }: { connection: Connection }) => {
  return (
    <div
      className="flex items-center justify-between bg-white p-4 rounded-lg"
    >
      <div className="flex items-center space-x-4">
        <Image
          src={connection.image}
          alt={connection.name}
          width={70}
          height={70}
          className="w-[70px] h-[70px] rounded-full object-cover ring-2 ring-gray-300"
        />
        <span className="text-gray-800 font-medium">{connection.name}</span>
      </div>
      <button className="text-gray-700">
        <Ellipsis size={28}/>
      </button>
    </div>
  );
};

export default MyConnectionCard;
