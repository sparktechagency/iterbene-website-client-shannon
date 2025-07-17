import VerifyEmail from "@/components/pages/auth/verify-email";
import { Loader2 } from "lucide-react";
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
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      }
    >
      <VerifyEmail />
    </Suspense>
  );
};

export default VerifyEmailPage;
