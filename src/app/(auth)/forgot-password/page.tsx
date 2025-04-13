import ForgotPassword from "@/components/pages/auth/forgot-password";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Forgot Password - Iter Bene",
  description:
    "Forgot your password? Enter your email to receive instructions on how to reset it and regain access to your Iter Bene account.",
};

const page = () => {
  return <ForgotPassword/>
};

export default page;
