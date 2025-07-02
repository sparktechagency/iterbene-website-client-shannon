"use client";
import authImage from "@/asset/auth/auth.jpg";
import logo from "@/asset/logo/logo.png";
import CustomButton from "@/components/custom/custom-button";
import CustomForm from "@/components/custom/custom-form";
import CustomInput from "@/components/custom/custom-input";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { TError } from "@/types/error";
import { forgotPasswordValidationSchema } from "@/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
const ForgotPassword = () => {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const handleLogin = async (values: FieldValues) => {
    try {
      const res = await forgotPassword(values).unwrap();
      const accessToken = res?.data?.attributes?.accessToken;
      //set access token in cookies
      Cookies.set("accessToken", accessToken, {
        expires: 7,
      });
      //redirect to verify email page
      toast.success(res?.message);
      router.push("/verify-email?type=forgot-password");
    } catch (error) {
      const err = error as TError;
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
          filter: "blur(8px)", // Apply blur effect to background image
        }}
        className="absolute top-0 left-0 w-full h-full"
      ></div>
      {/* Semi-transparent color overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#40E0D054]"></div>
      {/* Content that remains sharp */}
      <div className="w-full max-w-[500px] mx-auto px-8 md:px-[65px] py-12 md:py-[56px] bg-[#FFFFFF] z-30 rounded-xl border-2 border-primary shadow-xl shadow-gray-900">
        <div className="flex justify-between">
          <h1 className="text-xl lg:text-3xl xl:text-4xl font-semibold">
            Forgot Password
          </h1>
          <Image
            src={logo}
            alt="logo"
            width={128}
            height={128}
            className="ml-2 w-[90px] md:w-[128px] md:h-[115px]"
          />
        </div>
        {/* Form content */}
        <CustomForm
          onSubmit={handleLogin}
          resolver={zodResolver(forgotPasswordValidationSchema)}
        >
          <div className="space-y-3 md:space-y-6 mt-8">
            <CustomInput
              name="email"
              label="Email"
              type="email"
              variant="outline"
              icon={<Mail size={24} className="text-secondary" />}
              size="lg"
              fullWidth
              placeholder="Enter your email"
            />
            <CustomButton loading={isLoading} fullWidth className="py-4">
              Send OTP
            </CustomButton>
            <div className="flex gap-1 items-center justify-center">
              <span className="text-sm md:text-[16px] font-medium">
                Back To
              </span>
              <Link
                href="/login"
                className="text-sm md:text-[16px] font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </div>
          </div>
        </CustomForm>
      </div>
    </section>
  );
};

export default ForgotPassword;