"use client";
import React, { useState } from "react";
import { PiPlus } from "react-icons/pi";
import CustomModal from "@/components/custom/custom-modal";
import Image from "next/image";
import { FiUpload } from "react-icons/fi";
import { MdChangeCircle } from "react-icons/md";
import CustomForm from "@/components/custom/custom-form";
import CustomInput from "@/components/custom/custom-input";
import CustomSelectField from "@/components/custom/custom-seletectField";
import { FieldValues } from "react-hook-form";
import { LocateIcon, Lock } from "lucide-react";
import CustomButton from "@/components/custom/custom-button";
import { IoClose } from "react-icons/io5";

const CreateEvent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
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
  const handleFormSubmit = (data: FieldValues) => {
    console.log(data);
  };
  return (
    <section className="w-full mb-8">
      <button
        onClick={openModal}
        className="w-full bg-[#FEEFE8] text-secondary flex justify-center items-center gap-2 font-semibold px-5 py-3.5 rounded-xl border border-secondary transition cursor-pointer"
      >
        <PiPlus size={24} />
        <span>Create New Event</span>
      </button>

      {/* Render the Modal */}
      <CustomModal
        header={
          <div className="flex items-center justify-between p-6 border-b border-gray-200 rounded-t-xl">
            <h2 className="text-xl font-semibold text-gray-800">Create Event</h2>
            <button
              className="text-gray-600  border-gray-400 cursor-pointer size-12 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
              onClick={closeModal}
            >
              <IoClose size={24} />
            </button>
          </div>
        }
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        {/* Group Cover Image */}
        <div className="w-full h-32 bg-gray-200 rounded-xl mb-4 relative flex items-center justify-center">
          {groupImage ? (
            <div className="relative w-full h-full">
              <Image
                src={groupImage}
                alt="Group Cover"
                width={300}
                height={200}
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
              <span className="text-gray-500 text-sm mt-1">Upload Cover</span>
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
        <CustomForm onSubmit={handleFormSubmit}>
          <div className="flex flex-col gap-6 mt-8">
            <CustomInput
              type="text"
              required
              name="groupName"
              placeholder="Group name"
            />
            {/* Location */}
            <CustomInput
              type="text"
              required
              name="location"
              icon={<LocateIcon size={24} className="text-[#9194A9]" />}
              placeholder="Location"
            />
            {/* Who can see the event? */}
            <CustomSelectField
              items={[{ label: "Public", value: "public" },{ label: "Private", value: "private" }]}
              icon={<Lock size={22} className="text-[#9194A9]" />}
              name="visibility"
              required
            />

            {/* Description */}
            <CustomInput
              type="textarea"
              name="description"
              isTextarea
              placeholder="Description"
              required
            />
            <CustomButton
              type="submit"
              className="px-5 py-3.5 rounded-xl border  transition cursor-pointer"
            >
              <span>Create Event</span>
            </CustomButton>
          </div>
        </CustomForm>
      </CustomModal>
    </section>
  );
};

export default CreateEvent;
