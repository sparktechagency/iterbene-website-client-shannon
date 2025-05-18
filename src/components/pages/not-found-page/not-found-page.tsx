import logo from "@/asset/not-found/not-found.png";
import CustomButton from "@/components/custom/custom-button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  return (
    <section className="w-full min-h-screen  flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <Image
          src={logo}
          alt="Page not found"
          width={500}
          height={500}
          className="mx-auto mb-8"
          priority
        />
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800  mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md mx-auto">
          It looks like you’ve wandered off the path. Let’s get you back home!
        </p>
        <Link href="/" className="flex justify-center">
          <CustomButton
            variant="outline"
            className="px-6 py-3 bg-primary text-white hover:bg-primary-dark transition-colors duration-300 rounded-full text-lg font-medium"
          >
            Back to Home
          </CustomButton>
        </Link>
      </motion.div>
    </section>
  );
};

export default NotFoundPage;