"use client";
import Header from "@/components/common/header";
import Chats from "@/components/pages/message-inbox/chats/chats";
import useUser from "@/hooks/useUser";
import { useSocket } from "@/lib/socket";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const { socket } = useSocket();

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("user/connectInMessageBox", { userId: user?._id });
      return () => {
        socket.emit("user/disconnectInMessageBox", { userId: user?._id });
      };
    }
  }, [socket, user]);

  return (
    <section className="w-full">
      <Header />
      <section className="w-full container pt-[125px]">
        <div className="w-full p-6 flex flex-col md:flex-row gap-6 bg-white rounded-xl">
          <div className="w-full md:w-[25%]">
            <Chats />
          </div>
          <div className="w-full md:w-[75%] mx-auto">{children}</div>
        </div>
      </section>
    </section>
  );
};

export default Layout;
