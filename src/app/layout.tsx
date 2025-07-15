import "./globals.css";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers";
import UserVerificationWrapper from "@/components/common/UserVerificationWrapper";
import AuthModalWrapper from "@/components/common/AuthModalWrapper";

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
    <html lang="en">
      <body className={inter?.className}>
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
      </body>
    </html>
  );
}
