import Login from "@/components/pages/auth/login";
import { Loader2 } from "lucide-react";
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
      <Loader2 className="animate-spin text-primary" size={28} />
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
