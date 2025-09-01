import VerifyOtp from "@/components/pages/auth/verify-otp";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Verify otp - Iter Bene",
  description:
    "Please verify your OTP  code to complete the registration process and start exploring Iter Bene.",
};

const VerifyOtpPage = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      }
    >
      <VerifyOtp />
    </Suspense>
  );
};

export default VerifyOtpPage;
