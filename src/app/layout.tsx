import "./globals.css";
import type { Metadata, Viewport } from "next";
import {PT_Sans } from "next/font/google";
// import { Arimo, Epilogue, Open_Sans, PT_Sans, Roboto_Mono, Source_Sans_3 } from "next/font/google";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers";
import UserVerificationWrapper from "@/components/common/UserVerificationWrapper";
import AuthModalWrapper from "@/components/common/AuthModalWrapper";
import { BrowserExtensionSafe } from "@/utils/hydrationUtils";

const inter = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display:"swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Iter Bene - Explore New Destinations",
  description:
    "Connect with travelers, share your adventures, and explore new destinations on Iter Bene.",
  other: {
    "X-UA-Compatible": "IE=edge",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#40E0D0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter?.className} suppressHydrationWarning>
        <BrowserExtensionSafe>
          <AntdRegistry>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#40E0D0",
                },
              }}
            >
              <Providers>
                <UserVerificationWrapper />
                <AuthModalWrapper />
                {children}
                <Toaster position="top-center" />
              </Providers>
            </ConfigProvider>
          </AntdRegistry>
        </BrowserExtensionSafe>
      </body>
    </html>
  );
}
