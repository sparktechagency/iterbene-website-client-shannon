import PrivacyPolicy from "@/components/pages/PrivacyPolicy/PrivacyPolicy";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Privacy Policy - Iter Bene",
  description:
    "Learn more about our privacy policy and how we collect, use, and protect your personal information on Iter Bene.",
};
const page = () => {
  return <PrivacyPolicy />;
};

export default page;
