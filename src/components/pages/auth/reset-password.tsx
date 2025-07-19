"use client";
import authImage from "@/asset/auth/auth.jpg";
import logo from "@/asset/logo/logo.png";
import CustomButton from "@/components/custom/custom-button";
import CustomForm from "@/components/custom/custom-form";
import CustomInput from "@/components/custom/custom-input";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { TError } from "@/types/error";
import { resetPasswordValidationSchema } from "@/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
const ResetPassword = () => {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const handleResetPassword = async (values: FieldValues) => {
    try {
      const res = await resetPassword({password:values?.newPassword}).unwrap();
      toast.success(res?.message);
      router.push("/login");
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
      <div className="w-full max-w-[500px] mx-auto px-8 xl:px-[65px] py-12 xl:py-[56px] bg-[#FFFFFF] z-30 rounded-xl border-2 border-primary shadow-xl shadow-gray-900">
        <div className="flex justify-between">
          <h1 className="text-xl lg:text-3xl xl:text-4xl font-semibold">
            Reset Password
          </h1>
          <Image
            src={logo}
            alt="logo"
            width={128}
            height={128}
            className="ml-2 w-[90px] md:w-[100px] md:h-[90px] xl:w-[128px] xl:h-[115px]"
          />
        </div>
        {/* Form content */}
        <CustomForm
          onSubmit={handleResetPassword}
          resolver={zodResolver(resetPasswordValidationSchema)}
        >
          <div className="space-y-3 md:space-y-6 mt-8">
            <CustomInput
              name="newPassword"
              label="New Password"
              fullWidth
              size="lg"
              icon={<Lock size={24} className="text-secondry" />}
              placeholder="Enter new password"
              variant="outline"
              type="password"
            />
            <CustomInput
              name="confirmPassword"
              label="Confirm Password"
              fullWidth
              size="lg"
              icon={<Lock size={24} className="text-second" />}
              placeholder="Enter confirm password"
              variant="outline"
              type="password"
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
        </CustomForm>
      </div>
    </section>
  );
};

export default ResetPassword;
