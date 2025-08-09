import CreateJourney from "@/components/pages/Journey/CreateJourney";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journeys - Iter Bene",
  description:
    "Discover and connect with travelers, share your adventures, and explore new destinations on Iter Bene.",
};
const page = () => {
  return <CreateJourney />;
};

export default page;
