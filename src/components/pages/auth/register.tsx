"use client";
import authImage from "@/asset/auth/auth.jpg";
import logo from "@/asset/logo/logo.png";
import CustomForm from "@/components/custom/custom-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerValidationSchema,
} from "@/validation/auth.validation";
import { FieldValues } from "react-hook-form";
import CustomInput from "@/components/custom/custom-input";
import { Lock, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import CustomButton from "@/components/custom/custom-button";
import { Checkbox } from "antd";
const Register = () => {
  const handleRegister = async (values: FieldValues) => {
    console.log(values);
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
      <div className="w-full max-w-[500px] mx-auto px-8 md:px-[65px] py-12 md:py-[56px] bg-[#FFFFFF] z-30 rounded-lg border-2 border-primary shadow-xl shadow-gray-900">
        <div className="flex justify-between">
          <h1 className="text-xl lg:text-3xl xl:text-4xl font-semibold">
            Register
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
          onSubmit={handleRegister}
          resolver={zodResolver(registerValidationSchema)}
        >
          <div className="space-y-3 md:space-y-6 mt-8">
            <CustomInput
              name="fullName"
              label="Full Name"
              type="text"
              varient="outline"
              size="lg"
              icon={<UserRound size={24} className="text-secondary" />}
              fullWidth
              placeholder="Enter your full name"
            />
            <CustomInput
              name="email"
              label="Email"
              type="email"
              varient="outline"
              icon={<Mail size={24} className="text-secondary" />}
              size="lg"
              fullWidth
              placeholder="Enter your email"
            />
            <CustomInput
              name="password"
              label="Password"
              varient="outline"
              type="password"
              size="lg"
              icon={<Lock size={24} className="text-secondary" />}
              fullWidth
              placeholder="Enter your password"
            />
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="remember"
                    className="border-primary cursor-pointer "
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm md:text-[16px]">
                    I agree to all terms & conditions.
                  </label>
                </div>
              </div>
            </div>
            <CustomButton fullWidth className="py-4">
              Register
            </CustomButton>
            <div className="flex gap-1 items-center justify-center">
              <span className="text-sm md:text-[16px] font-medium">
                Already have an account?
              </span>
              <Link
                href="/login"
                className="text-md font-medium text-primary hover:underline"
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

export default Register;
