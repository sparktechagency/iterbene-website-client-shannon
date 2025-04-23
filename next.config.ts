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
    domains: ["i.ibb.co.com","images.unsplash.com","randomuser.me","i.postimg.cc","images.pexels.com","api.dicebear.com"],
  }
};

export default nextConfig;
