"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FiUpload } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MdChangeCircle } from "react-icons/md";

// Define the TypeScript interface for the form data
interface GroupFormData {
  groupName: string;
  location: string;
  visibility: string;
  interest: string;
  coLeaders: string;
  showPeopleList: boolean;
}

// Define the TypeScript interface for the modal props
interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
}) => {
  // State for group cover image
  const [groupImage, setGroupImage] = useState<string | null>(null);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<GroupFormData>({
    defaultValues: {
      groupName: "",
      location: "",
      visibility: "Public",
      interest: "",
      coLeaders: "",
      showPeopleList: false,
    },
  });

  // Watch the showPeopleList checkbox value
  const showPeopleList = watch("showPeopleList");

  // Prevent background scrolling and apply blur when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
      document.body.style.paddingRight = "15px"; // Adjust for scrollbar width to prevent layout shift
    } else {
      document.body.style.overflow = "auto"; // Re-enable scrolling
      document.body.style.paddingRight = "0";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0";
      document.querySelector(".bg-content")?.classList.remove("blur-sm");
    };
  }, [isOpen]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke the previous object URL to prevent memory leaks
      if (groupImage) {
        URL.revokeObjectURL(groupImage);
      }
      const imageUrl = URL.createObjectURL(file);
      setGroupImage(imageUrl);
    }
  };

  // Handle form submission
  const handleGroupCreate: SubmitHandler<GroupFormData> = (data) => {
    // Create the group data object, including the image
    const groupData = {
      ...data,
      coverImage:
        groupImage || "https://via.placeholder.com/300x150?text=Group+Cover", // Fallback to placeholder if no image is uploaded
    };

    // Log the data for now (you can replace this with an API call or other logic)
    console.log("Group Created:", groupData);

    // Close the modal after submission
    onClose();

    // Reset the form and image state
    setGroupImage(null);
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="w-full h-screen bg-black/50 fixed inset-0 flex items-center justify-center z-50 p-5"
          onClick={onClose}
        >
          <motion.div
            className="w-full h-[600px] md:h-[800px] bg-white rounded-xl p-6 max-w-2xl relative overflow-y-auto custom-scrollbar"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Create group
              </h2>
              <button onClick={onClose}>
                <IoClose
                  size={24}
                  className="text-gray-500 hover:text-gray-700"
                />
              </button>
            </div>

            {/* Group Cover Image */}
            <div className="w-full h-32 bg-gray-200 rounded-xl mb-4 relative flex items-center justify-center">
              {groupImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={groupImage}
                    alt="Group Cover"
                    width={300}
                    height={150}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {/* Change Image Button */}
                  <label className="absolute top-2 right-2 bg-white rounded-full p-2 cursor-pointer shadow-md">
                    <MdChangeCircle size={24} className="text-orange-500" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center h-full">
                  <FiUpload size={24} className="text-gray-500" />
                  <span className="text-gray-500 text-sm mt-1">
                    Upload Cover
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {/* Leader Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full">
                <Image
                  src="https://randomuser.me/api/portraits/women/1.jpg" // Random user image
                  alt="Leader"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <p className="text-gray-800 font-semibold">Alexandra Brooke</p>
                <p className="text-gray-500 text-sm">Leader • Your Profile</p>
              </div>
              <button className="ml-auto text-gray-500">...</button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(handleGroupCreate)}
              className="space-y-4"
            >
              {/* Group Name */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Group name
                </label>
                <input
                  type="text"
                  placeholder="Group name"
                  className={`w-full border border-[#E2E8F0] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.groupName ? "border-red-500" : ""
                    }`}
                  {...register("groupName", {
                    required: "Group name is required",
                  })}
                />
                {errors.groupName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.groupName.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Location"
                  className={`w-full border border-[#E2E8F0] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.location ? "border-red-500" : ""
                    }`}
                  {...register("location", {
                    required: "Location is required",
                  })}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Who can see the event? */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Who can see the event?
                </label>
                <select
                  className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  {...register("visibility", {
                    required: "Visibility is required",
                  })}
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Friends">Friends</option>
                </select>
              </div>

              {/* What's the interest? */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  What&apos;s the interest?
                </label>
                <textarea
                  placeholder="What's the interest?"
                  className={`w-full border border-[#E2E8F0] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none h-24 ${errors.interest ? "border-red-500" : ""
                    }`}
                  {...register("interest", {
                    required: "Interest description is required",
                  })}
                />
                {errors.interest && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.interest.message}
                  </p>
                )}
              </div>

              {/* Add Co-leaders */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Add co-leaders
                </label>
                <input
                  type="text"
                  placeholder="Add co-leaders"
                  className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  {...register("coLeaders")}
                />
                <p className="text-gray-500 text-sm mt-1">
                  Co-leaders can accept or decline once you published your
                  group.
                </p>
              </div>

              {/* Additional Settings */}
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Additional settings
                </label>
                <div className="flex items-center justify-between bg-gray-100 rounded-xl px-3 py-2">
                  <span className="text-gray-700">Show people list</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      {...register("showPeopleList")}
                    />
                    <div
                      className={`w-11 h-6 rounded-full transition-all ${showPeopleList ? "bg-primary" : "bg-gray-200"
                        }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all ${showPeopleList ? "translate-x-5" : ""
                        }`}
                    ></div>
                  </label>
                </div>
              </div>

              {/* Create Group Button */}
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-xl mt-6 hover:bg-orange-600 transition"
              >
                Create New Group
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateGroupModal;
