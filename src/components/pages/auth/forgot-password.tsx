"use client";
import authImage from "@/asset/auth/auth.jpg";
import logo from "@/asset/logo/logo.png";
import CustomButton from "@/components/custom/custom-button";
import CustomInput from "@/components/custom/custom-input";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { TError } from "@/types/error";
import { COOKIE_NAMES, setCookie } from "@/utils/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// define forgot password zod schema
const forgotPasswordValidationSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
});
type ForgotPasswordFormType = z.infer<typeof forgotPasswordValidationSchema>;
const ForgotPassword = () => {
  const router = useRouter();
  // Using direct import

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordValidationSchema),
  });

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const handleForgotPassword = async (values: FieldValues) => {
    try {
      const res = await forgotPassword(values).unwrap();

      // Set forgotPasswordMail cookie with email for simple token management
      setCookie(COOKIE_NAMES.VERIFY_OTP_MAIL, values.email);
      setCookie(COOKIE_NAMES.VERIFY_OTP_TYPE, "forgot-password");

      // Redirect to verify email page
      toast.success(res?.message);
      router.push(`/verify-otp`);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <section className="w-full min-h-screen flex items-center justify-center relative p-3 sm:p-5">
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
      <div className="w-full max-w-[500px] mx-auto px-4 sm:px-6 md:px-8 xl:px-[65px] pt-4 sm:pt-6 pb-8 sm:pb-12 bg-[#FFFFFF] z-30 rounded-xl border-2 border-primary shadow-xl shadow-gray-900">
        <div className="flex flex-col items-center gap-4 justify-center">
          <Image
            src={logo}
            alt="logo"
            width={128}
            height={128}
            className="ml-2 w-[70px] sm:w-[80px] md:w-[90px] lg:w-[100px] h-auto"
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
            Forgot Password
          </h1>
        </div>
        {/* Form content */}
        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="flex flex-col gap-4"
        >
          <div className="space-y-3 sm:space-y-4 md:space-y-6 mt-6 sm:mt-8">
            <CustomInput
              name="email"
              label="Email"
              type="email"
              variant="default"
              icon={<Mail size={23} className="text-secondary -mt-0.5" />}
              size="lg"
              fullWidth
              placeholder="Enter your email"
              register={register("email")}
              error={errors.email}
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
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
