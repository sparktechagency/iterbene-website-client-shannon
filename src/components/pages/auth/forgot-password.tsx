"use client";
import authImage from "@/asset/auth/auth.jpg";
import logo from "@/asset/logo/logo.png";
import CustomButton from "@/components/custom/custom-button";
import CustomInput from "@/components/custom/custom-input";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import { TError } from "@/types/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { handleAuthResponse } from "@/utils/tokenManager";
import { z } from "zod";

// define forgot password zod schema
const forgotPasswordValidationSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
});
type ForgotPasswordFormType = z.infer<typeof forgotPasswordValidationSchema>;
const ForgotPassword = () => {
  const router = useRouter();

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

      // Handle reset password token
      handleAuthResponse(res, "forgot-password");

      // Redirect to verify email page
      toast.success(res?.message);
      router.push(`/verify-email?type=forgot-password`);
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
      <div className="w-full max-w-[500px] mx-auto px-8 xl:px-[65px] pt-6 pb-12  bg-[#FFFFFF] z-30 rounded-xl border-2 border-primary shadow-xl shadow-gray-900">
        <div className="flex flex-col items-center gap-4 justify-center">
          <Image
            src={logo}
            alt="logo"
            width={128}
            height={128}
            className="ml-2 w-[90px] md:w-[100px] md:h-[90px] "
          />
          <h1 className="text-2xl md:text-3xl  font-semibold">
            Forgot Password
          </h1>
        </div>
        {/* Form content */}
        <form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="flex flex-col gap-4"
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
