import AboutUs from "@/components/pages/aboutus/AboutUs";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "About Us - Iter Bene",
  description:
    "Learn more about Iter Bene and our mission to connect travelers, share your adventures, and explore new destinations on Iter Bene.",
};
const page = () => {
  return <AboutUs />;
};

export default page;
