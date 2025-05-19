import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => [
    {
      source: "/",
      destination: "/feed",
      permanent: true,
    },
  ],
  images: {
    domains: [
      "marray-meet.s3.eu-north-1.amazonaws.com",
      "i.ibb.co.com",
      "images.unsplash.com",
      "randomuser.me",
      "i.postimg.cc",
      "images.pexels.com",
      "api.dicebear.com",
      "iter-bene.s3.eu-north-1.amazonaws.com"
    ],
  },
};

export default nextConfig;
