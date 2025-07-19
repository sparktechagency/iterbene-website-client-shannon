"use client";
import authImage from "@/asset/auth/auth.jpg";
import logo from "@/asset/logo/logo.png";
import CustomButton from "@/components/custom/custom-button";
import CustomForm from "@/components/custom/custom-form";
import CustomInput from "@/components/custom/custom-input";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { storeTokens } from "@/services/auth.services";
import { TError } from "@/types/error";
import { loginValidationSchema } from "@/validation/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "antd";
import { Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
const Login = () => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const handleLogin = async (values: FieldValues) => {
    try {
      const res = await login(values).unwrap();
      if (res?.data?.attributes?.user?.role === "admin") {
        toast.error("You are admin you can't login here!");
        return;
      }
      toast.success(res.message || "Login successful!");
      storeTokens(
        res?.data?.attributes?.tokens?.accessToken,
        res?.data?.attributes?.tokens?.refreshToken
      );
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <section className="w-full  h-screen flex items-center justify-center relative p-5">
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
          <h1 className="text-2xl md:text-3xl xl:text-4xl font-semibold">
            Login
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
          onSubmit={handleLogin}
          resolver={zodResolver(loginValidationSchema)}
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
            <CustomInput
              name="password"
              label="Password"
              variant="outline"
              type="password"
              size="lg"
              icon={<Lock size={24} className="text-secondary" />}
              fullWidth
              placeholder="Enter your email"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember" className="border-primary " />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm md:text-[16px] "
                >
                  Remember me
                </label>
              </div>
              <div>
                <Link
                  href="/forgot-password"
                  className="text-sm md:text-[16px] font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <CustomButton loading={isLoading} fullWidth className="py-4">
              Login
            </CustomButton>
            <div className="flex gap-1 items-center justify-center">
              <span className="text-sm md:text-[16px] font-medium">
                Don&apos;t have an account?
              </span>
              <Link
                href="/register"
                className="text-sm md:text-[16px] font-medium text-primary hover:underline"
              >
                Register
              </Link>
            </div>
          </div>
        </CustomForm>
      </div>
    </section>
  );
};

export default Login;
