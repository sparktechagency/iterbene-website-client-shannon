import ResetPassword from "@/components/pages/auth/reset-password";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Reset Password - Iter Bene",
  description:
    "Enter a new password to reset your Iter Bene account password. Make sure it’s strong and unique.",
};

const page = () => {
  return <ResetPassword/>
};

export default page;
