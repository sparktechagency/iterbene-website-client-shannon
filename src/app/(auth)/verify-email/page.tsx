import VerifyEmail from "@/components/pages/auth/verify-email";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify Email - Iter Bene",
  description:
    "Please verify your email address to complete the registration process and start exploring Iter Bene.",
};

const VerifyEmailPage = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <VerifyEmail />
    </Suspense>
  );
};

export default VerifyEmailPage;
