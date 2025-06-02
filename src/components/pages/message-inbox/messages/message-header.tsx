'use client';

import { useParams } from "next/navigation";

const MessageHeader = () => {
  const params = useParams();

  console.log(params)
  return (
    <div className="flex items-center p-4">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-800">Raul Fernandez</h1>
      </div>
    </div>
  );
};

export default MessageHeader;

