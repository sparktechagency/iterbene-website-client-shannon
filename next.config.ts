import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Suppress antd React 19 compatibility warnings
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/@ant-design/ },
      { module: /node_modules\/antd/ },
      /warning.*antd.*compatible/i,
    ];
    return config;
  },
  redirects: async () => [
    {
      source: "/",
      destination: "/feed",
      permanent: true,
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "i.postimg.cc",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "iter-bene.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_GOOGLE_MAP_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  },
};

export default nextConfig;
