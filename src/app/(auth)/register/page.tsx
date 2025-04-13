import Register from "@/components/pages/auth/register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Iter Bene",
  description:
    "Create a new account on Iter Bene and start sharing your travel adventures with the world.",
};

const page = () => {
  return <Register />
};

export default page;
