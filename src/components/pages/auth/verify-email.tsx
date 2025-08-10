"use client";
import authImage from "@/asset/auth/auth.jpg";
import logo from "@/asset/logo/logo.png";
import Image from "next/image";
import { useState, useEffect } from "react";
import CustomButton from "@/components/custom/custom-button";
import { useRouter, useSearchParams } from "next/navigation";
import OTPInput from "react-otp-input";
import {
  useResendOtpMutation,
  useVerifyEmailMutation,
} from "@/redux/features/auth/authApi";
import { TError } from "@/types/error";
import toast from "react-hot-toast";
import { storeTokens } from "@/services/auth.services";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const router = useRouter();
  const [oneTimeCode, setOneTimeCode] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(60); // 1 minute = 60 seconds
  const [canResend, setCanResend] = useState<boolean>(false);

  // verify email api
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  // resend otp api
  const [resendOtp, { isLoading: isResendLoading }] = useResendOtpMutation();

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Handle OTP change
  const handleOtpChange = (otpValue: string) => {
    setOneTimeCode(otpValue);
  };

  // Handle verify email
  const handleVerifyEmail = async () => {
    try {
      const res = await verifyEmail({ otp: oneTimeCode }).unwrap();
      console.log("Response:", res);
      storeTokens(
        res?.data?.attributes?.result?.tokens?.accessToken,
        res?.data?.attributes?.result?.tokens?.refreshToken
      );
      toast.success(res?.message);
      if (type == "forgot-password") {
        router.push(`/reset-password`);
      } else {
        router.push(`/`);
      }
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      await resendOtp(undefined).unwrap();
      toast.success("OTP sent successfully!");
      // Reset countdown
      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Failed to resend OTP!");
    }
  };

  // Format countdown time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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
          filter: "blur(8px)", // Apply blur effect to background image
        }}
        className="absolute top-0 left-0 w-full h-full"
      ></div>
      {/* Semi-transparent color overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#40E0D054]"></div>
      {/* Content that remains sharp */}
      <div className="w-full max-w-[500px] mx-auto px-8 xl:px-[65px] py-12 xl:py-[56px] bg-[#FFFFFF] z-30 rounded-xl border-2 border-primary shadow-xl shadow-gray-900">
        <div className="flex items-center justify-between">
          <h1 className="text-xl lg:text-3xl xl:text-4xl font-semibold">
            Verify Email
          </h1>
          <Image
            src={logo}
            alt="logo"
            width={128}
            height={128}
            className="ml-2 w-[80px] md:w-[90px] md:h-[90px] xl:w-[100px] xl:h-[90px]"
          />
        </div>
        <div className="w-full space-y-8">
          {/* OTP Instructions */}
          <div className="mt-4 text-center">
            <h1>
              Didn&apos;t receive the email? Please check your spam/junk folder
              as verification emails sometimes end up there.
            </h1>
          </div>

          <div className="w-full space-y-2">
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

          <div className="flex flex-col gap-3 items-center justify-center">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-sm md:text-[16px] font-medium">
                Don&apos;t receive OTP?
              </span>
              <button
                onClick={handleResendOtp}
                disabled={!canResend || isResendLoading}
                className={`text-sm md:text-[16px] font-medium ${
                  canResend
                    ? "text-primary hover:underline cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                } transition-colors duration-200`}
              >
                {isResendLoading ? "Sending..." : "Resend OTP"}
              </button>
            </div>

            {!canResend && (
              <div className="text-sm text-gray-600">
                Resend available in:{" "}
                <span className="font-semibold text-primary">
                  {formatTime(countdown)}
                </span>
              </div>
            )}

            {/* Additional help text */}
            <div className="text-center mt-2">
              <p className="text-xs text-gray-500">
                Still having trouble? Check your <strong>spam folder</strong> or
                try resending the code.
              </p>
            </div>
          </div>

          <CustomButton
            loading={isLoading}
            onClick={handleVerifyEmail}
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
