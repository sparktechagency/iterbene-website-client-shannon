"use client";
import Header from "@/components/common/header";
import Chats from "@/components/pages/message-inbox/chats/chats";
import useUser from "@/hooks/useUser";
import { useSocket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const { socket } = useSocket();
  const { receiverId } = useParams();

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("user/connectInMessageBox", { userId: user?._id });
      return () => {
        socket.emit("user/disconnectInMessageBox", { userId: user?._id });
      };
    }
  }, [socket, user]);

  return (
    <section className="w-full h-screen flex flex-col">
      <Header />
      <section className="w-full container mx-auto pt-[80px] md:pt-[100px] px-3 lg:pt-[125px] flex-1 overflow-hidden">
        <div className="w-full h-full p-0 md:p-6 flex gap-6 bg-white rounded-xl">
          <div
            className={`w-full md:w-[35%] lg:w-[30%] h-full transition-transform duration-300 ease-in-out ${receiverId ? "hidden md:block" : "block"}`}>
            <Chats />
          </div>
          <div
            className={`w-full md:w-[65%] lg:w-[70%] h-full transition-transform duration-300 ease-in-out ${receiverId ? "block" : "hidden md:block"}`}>
            {children}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Layout;
