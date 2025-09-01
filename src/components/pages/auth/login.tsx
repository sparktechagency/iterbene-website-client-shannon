"use client";
import authImage from "@/asset/auth/auth.jpg";
import logo from "@/asset/logo/logo.png";
import CustomButton from "@/components/custom/custom-button";
import CustomInput from "@/components/custom/custom-input";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { TError } from "@/types/error";
import { useCookies, COOKIE_NAMES } from "@/contexts/CookieContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "antd";
import { Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoginLockModal from "./LoginLockModal";
import { z } from "zod";

// define login zod validation schema
const loginValidationSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

// Define the login form type
type LoginFormData = z.infer<typeof loginValidationSchema>;

const Login = () => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const { setCookie } = useCookies();

   const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginValidationSchema)
  });


  // State for lock modal
  const [isLockModalVisible, setIsLockModalVisible] = useState(false);
  const [lockData, setLockData] = useState<{
    lockUntil: string;
    lockTime: number;
  } | null>(null);

  const handleLogin = async (values: FieldValues) => {
    try {
      const res = await login(values).unwrap();
      if (
        res?.data?.attributes?.user?.role === "Admin" ||
        res?.data?.attributes?.user?.role === "Super_Admin"
      ) {
        toast.error("You are admin you can't login here!");
        return;
      }

      // Check if user is locked
      if (res?.data?.attributes?.lockTime && res?.data?.attributes?.lockUntil) {
        setIsLockModalVisible(true);
        setLockData({
          lockUntil: res?.data?.attributes?.lockUntil,
          lockTime: res?.data?.attributes?.lockTime,
        });
        return;
      }

      // Check if email is not verified
      if (
        res?.message == "Email is not verified. Please verify your email." ||
        res?.message == "Please verify your email."
      ) {
        toast.success(res?.message);
        router.push("/verify-email");
        return;
      }
      
      // Set accessToken and refreshToken in cookies
      if (res?.data?.attributes?.tokens?.accessToken) {
        setCookie(COOKIE_NAMES.ACCESS_TOKEN, res.data.attributes.tokens.accessToken, 1); // 1 day
      }
      if (res?.data?.attributes?.tokens?.refreshToken) {
        setCookie(COOKIE_NAMES.REFRESH_TOKEN, res.data.attributes.tokens.refreshToken, 30); // 30 days
      }
      
      toast.success(res.message || "Login successful!");

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

  const handleCloseLockModal = () => {
    setIsLockModalVisible(false);
    setLockData(null);
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
          <h1 className="text-2xl md:text-3xl font-semibold">Login</h1>
        </div>

        {/* Form content */}
        <form
          onSubmit={handleSubmit(handleLogin)}
        >
          <div className="space-y-3 md:space-y-6 mt-8">
            <CustomInput
              name="email"
              label="Email"
              type="email"
              variant="default"
              icon={<Mail size={23} className="text-secondary -mt-1" />}
              size="lg"
              fullWidth
              placeholder="Enter your email"
              register={register("email")}
              error={errors.email}
            />
            <CustomInput
              name="password"
              label="Password"
              variant="default"
              type="password"
              size="lg"
              icon={<Lock size={23} className="text-secondary -mt-1" />}
              fullWidth
              placeholder="Enter your password"
              register={register("password")}
              error={errors.password}
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
        </form>
      </div>

      {/* Lock Modal */}
      {lockData && (
        <LoginLockModal
          isVisible={isLockModalVisible}
          lockUntil={lockData.lockUntil}
          lockTime={lockData.lockTime}
          onClose={handleCloseLockModal}
        />
      )}
    </section>
  );
};

export default Login;
