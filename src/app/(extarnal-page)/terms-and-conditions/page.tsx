import TermsAndConditions from "@/components/pages/TermsAndConditions/TermsAndConditions";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Terms and Conditions - Iter Bene",
  description:
    "Learn more about our terms and conditions and how we protect your privacy on Iter Bene.",
};
const page = () => {
  return <TermsAndConditions />;
};

export default page;
