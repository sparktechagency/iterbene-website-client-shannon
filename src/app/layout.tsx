import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });
import { ConfigProvider } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry';
export const metadata: Metadata = {
  title: "Iter Bene - Explore New Destinations",
  description: "Connect with travelers, share your adventures, and explore new destinations on Iter Bene.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <AntdRegistry>
          <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#40E0D0',
            },
          }}
          >
            <Providers>{children}</Providers>
            <Toaster />
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}