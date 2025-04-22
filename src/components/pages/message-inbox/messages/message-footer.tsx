"use client";
import { Camera, Send } from "lucide-react";
import React, { useState } from "react";

const MessageFooter = () => {
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="w-full p-5">
      <div className="px-4 py-2 border border-[#CAD1CF] flex items-center space-x-2 rounded-full">
        <button className="size-10 flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF]">
          <Camera size={22} />
        </button>
        <textarea
          placeholder="Type a message..."
          value={message}
          onChange={handleChange}
          rows={1}
          className="w-full p-2  focus:outline-none text-gray-800 placeholder-gray-500 resize-none"
        />
        <button className="size-10 flex justify-center items-center rounded-full flex-shrink-0 text-gray-500 hover:text-gray-700 border border-[#CAD1CF]">
          <Send size={22} />
        </button>
      </div>
    </div>
  );
};

export default MessageFooter;
