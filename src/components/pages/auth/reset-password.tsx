"use client";
import authImage from "@/asset/auth/auth.jpg";
import logo from "@/asset/logo/logo.png";
import CustomButton from "@/components/custom/custom-button";
import CustomInput from "@/components/custom/custom-input";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { TError } from "@/types/error";
import { clearAllTokens } from "@/utils/tokenManager";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// define reset password zod schema
const resetPasswordValidationSchema = z
  .object({
    newPassword: z
      .string({
        required_error: "Password is required",
      })
      .min(8, { message: "Password must be at least 8 characters long" }),

    confirmPassword: z
      .string({
        required_error: "Confirm Password is required",
      })
      .min(8, {
        message: "Confirm Password must be at least 8 characters long",
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], 
  });

  // define type for reset password form values
  type ResetPasswordFormValues = z.infer<typeof resetPasswordValidationSchema>;

const ResetPassword = () => {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordValidationSchema),
  });

  const handleResetPassword = async (values: FieldValues) => {
    try {
      const res = await resetPassword({
        password: values?.newPassword,
      }).unwrap();

      // Clear all tokens after successful password reset
      clearAllTokens();

      toast.success(
        res?.message || "Password reset successful! Please login again."
      );
      router.push("/auth");
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
            Reset Password
          </h1>
        </div>
        {/* Form content */}
        <form
          onSubmit={handleSubmit(handleResetPassword)}
        >
          <div className="space-y-3 md:space-y-6 mt-8">
            <CustomInput
              name="newPassword"
              label="New Password"
              fullWidth
              size="lg"
              icon={<Lock size={24} className="text-secondary" />}
              placeholder="Enter new password"
              variant="outline"
              type="password"
              register={register("newPassword")}
              error={errors.newPassword}
            />
            <CustomInput
              name="confirmPassword"
              label="Confirm Password"
              fullWidth
              size="lg"
              icon={<Lock size={24} className="text-secondary" />}
              placeholder="Enter confirm password"
              variant="outline"
              type="password"
              register={register("confirmPassword")}
              error={errors.confirmPassword}
            />
            <CustomButton loading={isLoading} fullWidth className="py-4">
              Reset
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

export default ResetPassword;
