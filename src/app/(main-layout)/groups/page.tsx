import Groups from "@/components/pages/groups/groups";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Groups - Iter Bene",
  description:
    "Discover and connect with travelers, share your adventures, and explore new destinations on Iter Bene.",
};
const page = () => {
  return <Groups />;
};

export default page;
