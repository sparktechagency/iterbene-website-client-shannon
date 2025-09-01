"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import CustomSelectField from "@/components/custom/custom-seletectField";
import CustomButton from "@/components/custom/custom-button";
import { useUpdateProfileMutation } from "@/redux/features/profile/profileApi";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import Image from "next/image";
import logo from "@/asset/logo/logo.png";
import useUser from "@/hooks/useUser";
import { setBooleanCookie, removeCookie, COOKIE_NAMES } from "@/utils/cookies";
import CustomInput from "../custom/custom-input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface FirstTimeUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define Zod schema for form validation
const firstTimeValidationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  referredAs: z.string().min(1, "Referred as is required"),
  ageRange: z.string().min(1, "Age range is required"),
  profession: z.string().min(1, "Profession is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
});

type FirstTimeUserFormData = z.infer<typeof firstTimeValidationSchema>;

const FirstTimeUserModal = ({ isOpen, onClose }: FirstTimeUserModalProps) => {
  // State
  const [isClient, setIsClient] = useState(false);
  const userData = useUser();

  
  // Initialize useForm with zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FirstTimeUserFormData>({
    resolver: zodResolver(firstTimeValidationSchema),
    defaultValues: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      phoneNumber: userData?.phoneNumber || "",
      referredAs: userData?.referredAs || "",
      ageRange: userData?.ageRange || "",
      profession: userData?.profession || "",
      maritalStatus: userData?.maritalStatus || "",
    },
  });

  // Hooks
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  // Using direct imports

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleProfileCompletion = async (values: FieldValues) => {
    try {
      const res = await updateProfile(values).unwrap();
      toast.success(res?.message || "Profile completed successfully!");
      setBooleanCookie(COOKIE_NAMES.PROFILE_COMPLETED, true);
      removeCookie(COOKIE_NAMES.IS_FIRST_TIME_USER);
      onClose();
    } catch (error) {
      const err = error as Error;
      toast.error(err?.message || "Something went wrong!");
    }
  };

  const handleSkip = () => {
    setBooleanCookie(COOKIE_NAMES.PROFILE_COMPLETED, true);
    removeCookie(COOKIE_NAMES.IS_FIRST_TIME_USER);
    onClose();
  };

  // Handle body overflow when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalBodyOverflow;
      };
    }
  }, [isOpen]);

  // Render nothing if not client-side, modal is not open, or userData is missing
  if (!isClient || !isOpen || !userData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10 cursor-pointer"
            >
              <X size={24} />
            </button>

            <div className="p-6 md:p-8">
              <motion.div
                className="text-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <Image
                  width={80}
                  height={80}
                  src={logo}
                  alt="Iter Bene Logo"
                  className="mx-auto mb-4"
                />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Complete Your Profile
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                  Please fill out your information to get the best travel
                  experience, just like Facebook!
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <form onSubmit={handleSubmit(handleProfileCompletion)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      type="text"
                      required
                      name="firstName"
                      placeholder="Enter your first name"
                      label="First Name"
                      register={register("firstName")}
                      error={errors.firstName}
                    />
                    <CustomInput
                      type="text"
                      required
                      name="lastName"
                      placeholder="Enter your last name"
                      label="Last Name"
                      register={register("lastName")}
                      error={errors.lastName}
                    />
                    <CustomInput
                      type="text"
                      required
                      name="phoneNumber"
                      placeholder="Enter your phone number"
                      label="Phone Number"
                      register={register("phoneNumber")}
                      error={errors.phoneNumber}
                    />
                    <CustomSelectField
                      items={[
                        { label: "He/Him", value: "He/Him" },
                        { label: "She/Her", value: "She/Her" },
                        { label: "They/Them", value: "They/Them" },
                        { label: "Undisclosed", value: "Undisclosed" },
                      ]}
                      name="referredAs"
                      label="Referred As"
                      size="md"
                      required
                      placeholder="Select how you are referred"
                      defaultValue={userData?.referredAs}
                      register={register("referredAs")}
                      error={errors.referredAs}
                    />
                    <CustomSelectField
                      items={[
                        { label: "13-17", value: "13-17" },
                        { label: "18-24", value: "18-24" },
                        { label: "25-34", value: "25-34" },
                        { label: "35-44", value: "35-44" },
                        { label: "45-54", value: "45-54" },
                        { label: "55-64", value: "55-64" },
                        { label: "65+", value: "65+" },
                      ]}
                      name="ageRange"
                      label="Age Range"
                      size="md"
                      required
                      placeholder="Select your age range"
                      defaultValue={userData?.ageRange}
                      register={register("ageRange")}
                      error={errors.ageRange}
                    />
                    <CustomInput
                      type="text"
                      name="profession"
                      required
                      placeholder="Enter your profession"
                      label="Profession"
                      register={register("profession")}
                      error={errors.profession}
                    />
                    <CustomSelectField
                      items={[
                        { label: "Single", value: "Single" },
                        { label: "Married", value: "Married" },
                        { label: "Divorced", value: "Divorced" },
                        { label: "Separated", value: "Separated" },
                        { label: "Widowed", value: "Widowed" },
                      ]}
                      required
                      name="maritalStatus"
                      label="Relationship Status"
                      size="md"
                      placeholder="Select your marital status"
                      defaultValue={userData?.maritalStatus}
                      register={register("maritalStatus")}
                      error={errors.maritalStatus}
                    />
                  </div>
                  <div className="mt-6 flex flex-col md:flex-row gap-4">
                    <CustomButton
                      type="button"
                      onClick={handleSkip}
                      variant="outline"
                      className="px-9 py-3"
                      fullWidth
                    >
                      Skip for now
                    </CustomButton>
                    <CustomButton
                      loading={isLoading}
                      type="submit"
                      variant="default"
                      className="px-9 py-3"
                      fullWidth
                    >
                      Complete Profile
                    </CustomButton>
                  </div>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="mt-6 text-center"
              >
                <p className="text-xs text-gray-500">
                  This information helps us provide better travel
                  recommendations and connect you with like-minded travelers.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FirstTimeUserModal;
