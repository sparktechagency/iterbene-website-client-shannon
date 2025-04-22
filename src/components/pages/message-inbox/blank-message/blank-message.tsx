import React from "react";
import chatRoom from "@/asset/chat/chatroom.png";
import Image from "next/image";
const BlankMessage = () => {
  return (
    <div className="w-full hidden md:flex h-[80vh]  justify-center items-center">
      <Image src={chatRoom} alt="chatRoom" width={500} height={500} />
    </div>
  );
};

export default BlankMessage;
