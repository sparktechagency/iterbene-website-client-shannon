"use client";
import authImage from "@/asset/auth/auth.jpg";
import logo from "@/asset/logo/logo.png";
import CustomButton from "@/components/custom/custom-button";
import CustomInput from "@/components/custom/custom-input";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "antd";
import { Lock, Mail, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FieldValues, useForm } from "react-hook-form";
import { TError } from "@/types/error";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCookies, COOKIE_NAMES } from "@/contexts/CookieContext";
import { handleAuthResponse } from "@/utils/tokenManager";
import { z } from "zod";

// define register zod validation schema
const registerValidationSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
});

// Define the Register component
type RegisterFormData = z.infer<typeof registerValidationSchema>;
const Register = () => {
  const [userRegistation, { isLoading }] = useRegisterMutation();
  const router = useRouter();
  const { setBooleanCookie } = useCookies();
   const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerValidationSchema)
  });



  const handleRegister = async (values: FieldValues) => {
    try {
      const res = await userRegistation(values).unwrap();

      // Handle tokens using secure token manager
      handleAuthResponse(res, "register");

      // Mark user as first-time user for profile completion modal
      setBooleanCookie(COOKIE_NAMES.IS_FIRST_TIME_USER, true);

      // Redirect to verify email page
      router.push("/verify-email");
      toast.success(res?.message);
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
          <h1 className="text-2xl md:text-3xl  font-semibold">Register</h1>
        </div>
        {/* Form content */}
        <form
          onSubmit={handleSubmit(handleRegister)}
        >
          <div className="space-y-3 md:space-y-6 mt-8">
            <CustomInput
              name="firstName"
              label="First Name"
              type="text"
              variant="outline"
              size="lg"
              icon={<UserRound size={24} className="text-secondary" />}
              fullWidth
              placeholder="Enter your first name"
              register={register("firstName")}
              error={errors.firstName}
            />
            <CustomInput
              name="lastName"
              label="Last Name"
              type="text"
              variant="outline"
              size="lg"
              icon={<UserRound size={24} className="text-secondary" />}
              fullWidth
              placeholder="Enter your last name"
              register={register("lastName")}
              error={errors.lastName}
            />
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
            <CustomInput
              name="password"
              label="Password"
              variant="outline"
              type="password"
              size="lg"
              icon={<Lock size={24} className="text-secondary" />}
              fullWidth
              placeholder="Enter your password"
              register={register("password")}
              error={errors.password}
            />
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="remember"
                    className="border-primary cursor-pointer "
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm md:text-[16px]"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms-and-conditions"
                      className="text-primary hover:underline"
                    >
                      Terms & Conditions
                    </Link>
                  </label>
                </div>
              </div>
            </div>
            <CustomButton loading={isLoading} fullWidth className="py-4">
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
        </form>
      </div>
    </section>
  );
};

export default Register;
