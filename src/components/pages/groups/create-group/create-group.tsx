"use client";
import CustomForm from "@/components/custom/custom-form";
import CustomInput from "@/components/custom/custom-input";
import CustomModal from "@/components/custom/custom-modal";
import Image from "next/image";
import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { MdChangeCircle } from "react-icons/md";
import { PiPlus } from "react-icons/pi";
// import CustomSelectField from "@/components/custom/custom-seletectField";
import CustomButton from "@/components/custom/custom-button";
import LocationSearchInput from "@/components/custom/LocationSearchInput";
import { LocationDetails } from "@/hooks/useGoogleLocationSearch";
import useUser from "@/hooks/useUser";
import { useGetMyConnectionsQuery } from "@/redux/features/connections/connectionsApi";
import { useCreateGroupMutation } from "@/redux/features/group/groupApi";
import { IMyConnections } from "@/types/connection.types";
import { TError } from "@/types/error";
import groupValidationSchema from "@/validation/group.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "antd";
import { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const { Option } = Select;

const CreateGroup: React.FC = () => {
  const user = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [groupFile, setGroupFile] = useState<File | null>(null);
  const [coLeaders, setCoLeaders] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationDetails | null>(null);
  const [descriptionLength, setDescriptionLength] = useState(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // Reset states when modal closes
    setSelectedLocation(null);
    setGroupFile(null);
    setGroupImage(null);
    setCoLeaders([]);
    setDescriptionLength(0);
  };

  // Get my all connections list
  const { data: responseData } = useGetMyConnectionsQuery({
    page: 1,
    limit: 10,
  });
  const myConnections = responseData?.data?.attributes?.results;

  // Create group mutation
  const [createGroup, { isLoading }] = useCreateGroupMutation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke the previous object URL to prevent memory leaks
      if (groupImage) {
        URL.revokeObjectURL(groupImage);
      }
      const imageUrl = URL.createObjectURL(file);
      setGroupImage(imageUrl);
      setGroupFile(file);
    }
  };



  const handleFormSubmit = async (values: FieldValues) => {
    // Validate location selection
    if (!selectedLocation) {
      toast.error("Please select a valid location");
      return;
    }
    // Validate group image
    if (!groupFile) {
      toast.error("Please upload a group image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", values.groupName);
      formData.append("description", values.description);
      formData.append(
        "location",
        JSON.stringify({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        })
      );
      formData.append("locationName", selectedLocation.name);
      formData.append("groupImage", groupFile || "");
      if (coLeaders.length > 0) {
        formData.append("coLeaders", JSON.stringify(coLeaders));
      }
      await createGroup(formData).unwrap();
      toast.success("Group created successfully!");
      closeModal();
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleCoLeaderChange = (value: string[]) => {
    setCoLeaders(value);
  };

  return (
    <>
      {user && (
        <section className="w-full mb-8">
          <button
            onClick={openModal}
            className="w-full bg-[#FEEFE8] text-secondary flex justify-center items-center gap-2 font-semibold px-5 py-3.5 rounded-xl border border-secondary transition cursor-pointer"
          >
            <PiPlus size={24} />
            <span>Create New Group</span>
          </button>

          {/* Render the Modal */}
          <CustomModal
            header={
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-800">
                  Create Group
                </h2>
                <button
                  className="text-gray-600  border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
                  onClick={closeModal}
                >
                  <IoClose size={18} />
                </button>
              </div>
            }
            isOpen={isModalOpen}
            onClose={closeModal}
            className="w-full p-2"
          >
            {/* Group Image */}
            <div className="w-full h-44 bg-[#DDDDDD] rounded-xl mb-4 relative flex items-center justify-center">
              {groupImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={groupImage}
                    alt="Group Image"
                    width={300}
                    height={300}
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
                    Upload group image
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
            <div className="flex items-center gap-3 my-4">
              {user && (
                <Image
                  src={user?.profileImage}
                  alt="Leader"
                  width={50}
                  height={50}
                  className="size-[50px] object-cover ring-2 ring-gray-300 rounded-full"
                />
              )}
              <div>
                <p className="text-gray-800 font-semibold">{user?.fullName}</p>
                <p className="text-gray-500 text-sm">Leader • Your Profile</p>
              </div>
            </div>

            {/* Form */}
            <CustomForm
              onSubmit={handleFormSubmit}
              resolver={zodResolver(groupValidationSchema)}
            >
              <div className="flex flex-col gap-6 mt-8">
                <CustomInput
                  type="text"
                  required
                  label="Group Name"
                  name="groupName"
                  placeholder="Group name"
                />

                {/* Reusable Location Search Component */}
                <LocationSearchInput
                  label="Location"
                  placeholder="Search for a location..."
                  required
                  onLocationSelect={(location) => setSelectedLocation(location)}
                  showSelectedInfo={false}
                />

                {/* Who can see the group? */}
                {/* <CustomSelectField
                  items={[
                    { label: "Public", value: "public" },
                    { label: "Private", value: "private" },
                  ]}
                  label="Who can see the group?"
                  icon={<Lock size={22} className="text-[#9194A9]" />}
                  placeholder="Who can see the group?"
                  name="privacy"
                  required
                /> */}

                {/* Description with Character Counter */}
                <div className="relative">
                  <CustomInput
                    type="textarea"
                    label="Description"
                    maxLength={395}
                    name="description"
                    isTextarea
                    placeholder="What are the details?"
                    required
                    onChange={(e) => setDescriptionLength(e.target.value.length)}
                  />

                  {/* Character counter with dynamic styling */}
                  <div
                    className={`text-sm mt-2 flex justify-between items-center transition-colors duration-200 ${
                      descriptionLength > 375 && descriptionLength < 395
                        ? "text-orange-500"
                        : descriptionLength === 395
                        ? "text-red-500 font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    <span>
                      {descriptionLength === 395
                        ? "Character limit reached! Cannot type more."
                        : descriptionLength > 375
                        ? `Only ${395 - descriptionLength} characters left`
                        : `${395 - descriptionLength} characters remaining`}
                    </span>
                    <span className="font-medium text-gray-700">
                      {descriptionLength}/395
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        descriptionLength < 300
                          ? "bg-green-500"
                          : descriptionLength < 375
                          ? "bg-yellow-500"
                          : descriptionLength < 395
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${(descriptionLength / 395) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <button className="size-6 flex justify-center items-center rounded-full flex-shrink-0 border-2">
                      <PiPlus size={18} />
                    </button>
                    <h1 className="text-base font-semibold text-gray-900">
                      Add co-leaders
                    </h1>
                  </div>
                  <div className="w-full bg-[#F2F3F5] p-6 rounded-xl">
                    <Select
                      mode="multiple"
                      allowClear
                      value={coLeaders}
                      onChange={handleCoLeaderChange}
                      style={{ width: "100%" }}
                      placeholder="Add co-leaders"
                      size="large"
                      className="text-gray-900"
                    >
                      {myConnections?.map((connection: IMyConnections) => (
                        <Option key={connection?._id} value={connection?._id}>
                          {connection?.fullName}
                        </Option>
                      ))}
                    </Select>
                    <h1 className="text-gray-600 mt-2">
                      Co-leaders can accept or decline once you&apos;ve
                      published your group.
                    </h1>
                  </div>
                </div>

                <CustomButton
                  loading={isLoading}
                  type="submit"
                  className="px-5 py-3.5 rounded-xl border transition cursor-pointer"
                >
                  <span>Create Group</span>
                </CustomButton>
              </div>
            </CustomForm>
          </CustomModal>
        </section>
      )}
    </>
  );
};

export default CreateGroup;
