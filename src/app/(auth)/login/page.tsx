import Login from "@/components/pages/auth/login";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Login - Iter Bene",
  description:
    "Sign in to your Iter Bene account to explore, connect, and share your travel experiences.",
};

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
