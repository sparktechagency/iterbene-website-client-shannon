import PhotosPage from "@/components/pages/PhotosPage/PhotosPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Photos - Iter Bene",
  description:
    "Discover and connect with travelers, share your adventures, and explore new destinations on Iter Bene.",
};
const page = () => {
  return (
    <section className="w-full space-y-5 md:space-y-8 overflow-y-auto">
      <PhotosPage />
    </section>
  );
};

export default page;
