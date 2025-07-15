"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import useUser from "@/hooks/useUser";
import {
  closeAuthModal,
  openAuthModal,
  setAuthStep,
} from "@/redux/features/auth/authModalSlice";
import {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
} from "@/redux/features/auth/authApi";
import { storeTokens } from "@/services/auth.services";
import { TError } from "@/types/error";
import toast from "react-hot-toast";
import { Checkbox } from "antd";
import OTPInput from "react-otp-input";
import Cookies from "js-cookie";
import Image from "next/image";
import { X, Mail, Lock, UserRound, ArrowLeft } from "lucide-react";
import logo from "@/asset/logo/logo.png";
import { useRouter, useSearchParams } from "next/navigation";

type ModalStep =
  | "welcome"
  | "login"
  | "register"
  | "forgot"
  | "verify"
  | "reset";

const AuthModal = () => {
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(
    (state: RootState) => state.auth.showAuthModal
  );
  const currentStep = useAppSelector(
    (state: RootState) => state.auth.currentStep
  );
  const isAuthenticated = useUser();
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [modalStep, setModalStep] = useState<ModalStep>("welcome");
  const [userEmail, setUserEmail] = useState<string>("");
  const [verifyType, setVerifyType] = useState<"register" | "forgot">(
    "register"
  );
  const [oneTimeCode, setOneTimeCode] = useState<string>("");
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const router = useRouter();

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    agree: false,
  });
  const [forgotForm, setForgotForm] = useState({ email: "" });
  const [resetForm, setResetForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // API hooks
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const [forgotPassword, { isLoading: forgotLoading }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: resetLoading }] =
    useResetPasswordMutation();
  const [verifyEmail, { isLoading: verifyLoading }] = useVerifyEmailMutation();

  // Check if client-side and UserVerification status
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const userVerified = localStorage.getItem("iterBeneVerified");
      setIsVerified(userVerified === "true");
    }
  }, []);

  // Sync local modalStep with Redux currentStep
  useEffect(() => {
    setModalStep(currentStep);
  }, [currentStep]);

  // Timer for showing modal after 30 seconds if not authenticated and verified
  useEffect(() => {
    if (!isAuthenticated && isVerified) {
      const timer = setTimeout(() => {
        dispatch(openAuthModal("welcome"));
      }, 30000); // 30 seconds
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isVerified, dispatch]);

  // Handle body overflow and prevent scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.classList.add("modal-open");

      const preventScroll = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };

      const preventScrollTouch = (e: TouchEvent) => {
        if (e.touches.length > 1) return;
        e.preventDefault();
        e.stopPropagation();
        return false;
      };

      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventScrollTouch, {
        passive: false,
      });
      document.addEventListener("scroll", preventScroll, { passive: false });
      document.addEventListener("keydown", (e) => {
        if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
          e.preventDefault();
        }
      });

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.classList.remove("modal-open");
        document.removeEventListener("wheel", preventScroll);
        document.removeEventListener("touchmove", preventScrollTouch);
        document.removeEventListener("scroll", preventScroll);
        document.removeEventListener("keydown", (e) => {
          if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
            e.preventDefault();
          }
        });
      };
    }
  }, [isModalOpen]);

  const handleClose = () => {
    dispatch(closeAuthModal());
    setModalStep("welcome");
    setLoginForm({ email: "", password: "", remember: false });
    setRegisterForm({ fullName: "", email: "", password: "", agree: false });
    setForgotForm({ email: "" });
    setResetForm({ newPassword: "", confirmPassword: "" });
    setOneTimeCode("");
  };

  const handleBack = () => {
    if (modalStep === "verify") {
      dispatch(setAuthStep(verifyType === "register" ? "register" : "forgot"));
    } else {
      dispatch(setAuthStep("welcome"));
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(loginForm).unwrap();
      if (res?.data?.attributes?.user?.role === "admin") {
        toast.error("You are admin you can't login here!");
        return;
      }
      toast.success(res.message || "Login successful!");
      storeTokens(
        res?.data?.attributes?.tokens?.accessToken,
        res?.data?.attributes?.tokens?.refreshToken
      );
      handleClose();
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

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await register(registerForm).unwrap();
      const accessToken = res?.data?.attributes?.accessToken;
      Cookies.set("accessToken", accessToken, { expires: 7 });
      setUserEmail(registerForm.email);
      setVerifyType("register");
      dispatch(setAuthStep("verify"));
      toast.success(res?.message);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Forgot password handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(forgotForm).unwrap();
      const accessToken = res?.data?.attributes?.accessToken;
      Cookies.set("accessToken", accessToken, { expires: 7 });
      setUserEmail(forgotForm.email);
      setVerifyType("forgot");
      dispatch(setAuthStep("verify"));
      toast.success(res?.message);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Verify email handler
  const handleVerifyEmail = async () => {
    try {
      const res = await verifyEmail({ otp: oneTimeCode }).unwrap();
      toast.success(res?.message);
      if (verifyType === "forgot") {
        dispatch(setAuthStep("reset"));
      } else {
        handleClose();
      }
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Reset password handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    try {
      const res = await resetPassword({
        password: resetForm.newPassword,
      }).unwrap();
      toast.success(res?.message);
      handleClose();
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const renderWelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl md:text-3xl text-center font-bold text-gray-800 mb-3">
        Welcome to Iter Bene!
      </h1>
      <p className="text-gray-600  text-center mb-6 text-sm md:text-base">
        Please log in to access all features and enjoy your premium travel
        experience.
      </p>
      <div className="space-y-4">
        <button
          onClick={() => dispatch(setAuthStep("login"))}
          className="w-full bg-secondary text-white py-3 px-6 rounded-lg font-medium hover:bg-secondary/90 transition-all duration-300"
        >
          Login to Your Account
        </button>
        <button
          onClick={() => dispatch(setAuthStep("register"))}
          className="w-full text-secondary border border-secondary py-3 px-6 rounded-lg font-medium hover:bg-secondary hover:text-white transition-all duration-300"
        >
          Create New Account
        </button>
        <button
          onClick={handleClose}
          className="w-full text-gray-600 py-2 px-6 rounded-lg font-medium hover:text-gray-800 transition-colors duration-300"
        >
          Maybe Later
        </button>
      </div>
    </motion.div>
  );

  const renderLoginStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="mr-3 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Login</h1>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary"
            size={20}
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
            required
          />
        </div>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary"
            size={20}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox
              checked={loginForm.remember}
              onChange={(e) =>
                setLoginForm({ ...loginForm, remember: e.target.checked })
              }
              className="border-primary"
            />
            <label className="ml-2 text-sm">Remember me</label>
          </div>
          <button
            type="button"
            onClick={() => dispatch(setAuthStep("forgot"))}
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <button
          type="submit"
          disabled={loginLoading}
          className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:bg-secondary/90 transition-all duration-300 disabled:opacity-50"
        >
          {loginLoading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center">
          <span className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
          </span>
          <button
            type="button"
            onClick={() => dispatch(setAuthStep("register"))}
            className="text-sm text-primary hover:underline font-medium"
          >
            Register
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderRegisterStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="mr-3 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Register</h1>
      </div>
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="relative">
          <UserRound
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary"
            size={20}
          />
          <input
            type="text"
            placeholder="Enter your full name"
            value={registerForm.fullName}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, fullName: e.target.value })
            }
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
            required
          />
        </div>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary"
            size={20}
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={registerForm.email}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, email: e.target.value })
            }
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
            required
          />
        </div>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary"
            size={20}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={registerForm.password}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, password: e.target.value })
            }
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
            required
          />
        </div>
        <div className="flex items-center">
          <Checkbox
            checked={registerForm.agree}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, agree: e.target.checked })
            }
            className="border-primary"
          />
          <label className="ml-2 text-sm">
            I agree to all terms & conditions.
          </label>
        </div>
        <button
          type="submit"
          disabled={registerLoading || !registerForm.agree}
          className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:bg-secondary/90 transition-all duration-300 disabled:opacity-50"
        >
          {registerLoading ? "Creating Account..." : "Register"}
        </button>
        <div className="text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
          </span>
          <button
            type="button"
            onClick={() => dispatch(setAuthStep("login"))}
            className="text-sm text-primary hover:underline font-medium"
          >
            Login
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderForgotStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="mr-3 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
      </div>
      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary"
            size={20}
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={forgotForm.email}
            onChange={(e) =>
              setForgotForm({ ...forgotForm, email: e.target.value })
            }
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
            required
          />
        </div>
        <button
          type="submit"
          disabled={forgotLoading}
          className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:bg-secondary/90 transition-all duration-300 disabled:opacity-50"
        >
          {forgotLoading ? "Sending OTP..." : "Send OTP"}
        </button>
        <div className="text-center">
          <span className="text-sm text-gray-600">Back to </span>
          <button
            type="button"
            onClick={() => dispatch(setAuthStep("login"))}
            className="text-sm text-primary hover:underline font-medium"
          >
            Login
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderVerifyStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="mr-3 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Verify Email</h1>
      </div>
      <div className="space-y-6">
        <p className="text-sm text-gray-600 text-center">
          We&apos;ve sent a verification code to <strong>{userEmail}</strong>
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter OTP
          </label>
          <OTPInput
            value={oneTimeCode}
            onChange={setOneTimeCode}
            numInputs={6}
            renderInput={(props) => <input {...props} />}
            containerStyle="flex justify-center gap-2"
            inputStyle={{
              width: "3rem",
              height: "3rem",
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "center",
              outline: "none",
              border: "1px solid #F95F19",
              borderRadius: "5px",
              transition: "border-color 0.3s ease",
            }}
          />
        </div>
        <button
          onClick={handleVerifyEmail}
          disabled={verifyLoading || oneTimeCode.length !== 6}
          className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:bg-secondary/90 transition-all duration-300 disabled:opacity-50"
        >
          {verifyLoading ? "Verifying..." : "Verify"}
        </button>
        <div className="text-center">
          <span className="text-sm text-gray-600">
            Don&apos;t receive OTP?{" "}
          </span>
          <button
            type="button"
            className="text-sm text-primary hover:underline font-medium"
            onClick={() => {
              // Implement resend OTP logic here if needed
              toast.success("OTP resent!");
            }}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderResetStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="mr-3 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
      </div>
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary"
            size={20}
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={resetForm.newPassword}
            onChange={(e) =>
              setResetForm({ ...resetForm, newPassword: e.target.value })
            }
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
            required
          />
        </div>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary"
            size={20}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={resetForm.confirmPassword}
            onChange={(e) =>
              setResetForm({ ...resetForm, confirmPassword: e.target.value })
            }
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary"
            required
          />
        </div>
        <button
          type="submit"
          disabled={resetLoading}
          className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:bg-secondary/90 transition-all duration-300 disabled:opacity-50"
        >
          {resetLoading ? "Resetting..." : "Reset Password"}
        </button>
        <div className="text-center">
          <span className="text-sm text-gray-600">Back to </span>
          <button
            type="button"
            onClick={() => dispatch(setAuthStep("login"))}
            className="text-sm text-primary hover:underline font-medium"
          >
            Login
          </button>
        </div>
      </form>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (modalStep) {
      case "welcome":
        return renderWelcomeStep();
      case "login":
        return renderLoginStep();
      case "register":
        return renderRegisterStep();
      case "forgot":
        return renderForgotStep();
      case "verify":
        return renderVerifyStep();
      case "reset":
        return renderResetStep();
      default:
        return renderWelcomeStep();
    }
  };

  if (!isClient || !isModalOpen || isAuthenticated || !isVerified) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
      style={{ touchAction: "none" }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10 cursor-pointer"
        >
          <X size={24} />
        </button>
        <div className="p-8">
          <motion.div
            className="text-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Image
              width={100}
              height={100}
              src={logo}
              alt="Iter Bene Logo"
              className="mx-auto mb-4"
            />
          </motion.div>
          <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-gray-500">
              Join thousands of travelers who trust Iter Bene for their journey
              planning
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
