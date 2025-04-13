"use client";
import authImage from "@/asset/auth/auth.jpg";
import logo from "@/asset/logo/logo.png";
import Image from "next/image";
import { useState } from "react";
// import Cookies from "js-cookie";
// import { useAppDispatch } from "@/redux/hooks";
import OTPInput from "react-otp-input";
import { useParams, useRouter } from "next/navigation";
import CustomButton from "@/components/custom/custom-button";
const VerifyEmail = () => {
  const { email } = useParams();
  const router = useRouter();
  const [oneTimeCode, setOneTimeCode] = useState<string>("");
//   const verifyToken = Cookies.get("verify-token");
//   const dispatch = useAppDispatch();
  // Handle OTP change
  const handleOtpChange = (otpValue: string) => {
    setOneTimeCode(otpValue);
  };
  const handleVerifyEmail = async () => {
    router.push(`/reset-password?email=${email}`);
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
      <div className="w-full max-w-[500px] mx-auto px-8 md:px-[65px] py-12 md:py-[56px] bg-[#FFFFFF] z-30 rounded-lg border-2 border-[#40E0D0] shadow-xl shadow-gray-900">
        <div className="flex items-center  justify-between">
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
              Don&apos;t receive OTP?
            </span>
            <button className="text-sm md:text-[16px] font-medium text-[#40E0D0] hover:underline">
              Resend OTP
            </button>
          </div>
          <CustomButton onClick={handleVerifyEmail} fullWidth className="py-4">
            Verify
          </CustomButton>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;
