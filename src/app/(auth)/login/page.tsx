import Login from "@/components/pages/auth/login";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login - Iter Bene",
  description:
    "Sign in to your Iter Bene account to explore, connect, and share your travel experiences.",
};

const LoginLoadingFallback = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <Login />
    </Suspense>
  );
};

export default LoginPage;
