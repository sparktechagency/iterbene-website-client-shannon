"use client";
import authImage from "@/asset/auth/auth.jpg";
import logo from "@/asset/logo/logo.png";
import Image from "next/image";
import { useState } from "react";
import CustomButton from "@/components/custom/custom-button";
import { useRouter, useSearchParams } from "next/navigation";
import OTPInput from "react-otp-input";
import { useVerifyEmailMutation } from "@/redux/features/auth/authApi";
import { TError } from "@/types/error";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || ""; // Fallback to empty string if null
  const router = useRouter();
  const [oneTimeCode, setOneTimeCode] = useState<string>("");
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  // Handle OTP change
  const handleOtpChange = (otpValue: string) => {
    setOneTimeCode(otpValue);
  };

  const handleVerifyEmail = async () => {
    if (oneTimeCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await verifyEmail({ otp: oneTimeCode }).unwrap();
      toast.success(res?.message);
      if (type === "forgot-password") {
        router.push("/reset-password");
      } else {
        router.push("/login");
      }
    } catch (error) {
      const err = error as TError;
      console.error("Error:", error);
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center relative p-5">
      {/* Background with blur effect */}
      <div
        style={{
          backgroundImage: `url(${authImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(8px)",
        }}
        className="absolute top-0 left-0 w-full h-full"
      ></div>
      {/* Semi-transparent color overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#40E0D054]"></div>
      {/* Content that remains sharp */}
      <div className="w-full max-w-[500px] mx-auto px-8 md:px-[65px] py-12 md:py-[56px] bg-[#FFFFFF] z-30 rounded-xl border-2 border-primary shadow-xl shadow-gray-900">
        <div className="flex items-center justify-between">
          <h1 className="text-xl lg:text-3xl xl:text-4xl font-semibold">
            Verify Email
          </h1>
          <Image
            src={logo}
            alt="logo"
            width={128}
            height={128}
            className="ml-2 w-[90px] md:w-[128px] md:h-[115px]"
          />
        </div>
        <div className="w-full space-y-8">
          <div className="w-full mt-8 space-y-2">
            <h1 className="text-xl">OTP</h1>
            <OTPInput
              value={oneTimeCode}
              onChange={handleOtpChange}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
              containerStyle="otp-container"
              inputStyle={{
                width: "100%",
                maxWidth: "7rem",
                height: "4rem",
                margin: "0 0.3rem",
                borderRadius: "5px",
                fontSize: "2rem",
                fontWeight: "bold",
                textAlign: "center",
                outline: "none",
                border: "1px solid #F95F19",
                transition: "border-color 0.3s ease",
              }}
            />
          </div>
          <div className="flex gap-1 items-center justify-center">
            <span className="text-sm md:text-[16px] font-medium">
              Don&#39;t receive OTP?
            </span>
            <button className="text-sm md:text-[16px] font-medium text-primary hover:underline">
              Resend OTP
            </button>
          </div>
          <CustomButton
            loading={isLoading}
            onClick={handleVerifyEmail}
            disabled={oneTimeCode.length !== 6 || isLoading}
            fullWidth
            className="py-4"
          >
            Verify
          </CustomButton>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;