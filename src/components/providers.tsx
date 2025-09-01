"use client";
import { Provider as ReduxProvider } from "react-redux";
import { SocketProvider } from "@/lib/socket";
import { store } from "@/redux/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <SocketProvider>{children}</SocketProvider>
    </ReduxProvider>
  );
}