"use client";
import { socketUrl } from "@/config/config";
import { createContext, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

// Create a globally accessible socket instance
export const socket = io(socketUrl, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket", "polling"],
  secure: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Remove console logs for production performance
    socket.on("connect", () => {});
    socket.on("disconnect", () => {});
    socket.on("reconnect_failed", () => {});

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
