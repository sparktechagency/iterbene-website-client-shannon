"use client";
import { Provider as ReduxProvider } from "react-redux";
import { SocketProvider } from "@/lib/socket";
import { store } from "@/redux/store";
import { CookieProvider } from "@/contexts/CookieContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <CookieProvider>
        <SocketProvider>{children}</SocketProvider>
      </CookieProvider>
    </ReduxProvider>
  );
}