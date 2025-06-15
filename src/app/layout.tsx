import "./globals.css";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "@/lib/socket";
import Providers from "@/components/providers";

const inter = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Iter Bene - Explore New Destinations",
  description:
    "Connect with travelers, share your adventures, and explore new destinations on Iter Bene.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#40E0D0",
              },
            }}
          >
            <SocketProvider>
              <Providers>
                <Toaster position="top-center" />
                <div id="google_translate_element" />
                {children}
              </Providers>
            </SocketProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
