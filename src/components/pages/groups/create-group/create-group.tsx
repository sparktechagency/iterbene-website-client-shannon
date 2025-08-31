"use client";
import CustomInput from "@/components/custom/custom-input";
import CustomModal from "@/components/custom/custom-modal";
import Image from "next/image";
import React, { useState, DragEvent } from "react";
import { BsCamera, BsStars } from "react-icons/bs";
import { HiOutlinePhotograph } from "react-icons/hi";
import { AnimatePresence } from "framer-motion";
import useUser from "@/hooks/useUser";
import { useGetMyConnectionsQuery } from "@/redux/features/connections/connectionsApi";
import { useCreateGroupMutation } from "@/redux/features/group/groupApi";
import { TError } from "@/types/error";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/custom/custom-button";
import { Select } from "antd";
import { IMyConnections } from "@/types/connection.types";

const { Option } = Select;

// Define Zod schema for form validation
const groupSchema = z.object({
  groupName: z
    .string()
    .min(1, "Group Name is required")
    .max(100, "Group Name must be 100 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(395, "Description must be 395 characters or less"),
  coLeaders: z.array(z.string()).optional(),
});

type GroupFormData = z.infer<typeof groupSchema>;

const CreateGroup: React.FC = () => {
  const user = useUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [groupFile, setGroupFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [coLeaders, setCoLeaders] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      groupName: "",
      description: "",
      coLeaders: [],
    },
  });

  const { data: responseData } = useGetMyConnectionsQuery({
    page: 1,
    limit: 10,
  });
  const myConnections = responseData?.data?.attributes?.results;

  const [createGroup, { isLoading }] = useCreateGroupMutation();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setGroupFile(null);
    setGroupImage(null);
    setCoLeaders([]);
    setValue("groupName", "");
    setValue("description", "");
    setValue("coLeaders", []);
    setIsDragOver(false);
  };

  const processImageFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      if (groupImage) {
        URL.revokeObjectURL(groupImage);
      }
      const imageUrl = URL.createObjectURL(file);
      setGroupImage(imageUrl);
      setGroupFile(file);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleCoLeaderChange = (value: string[]) => {
    setCoLeaders(value);
    setValue("coLeaders", value);
  };

  const handleFormSubmit = async (values: GroupFormData) => {
    if (!groupFile) {
      toast.error("Please upload a group image.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", values.groupName);
      formData.append("description", values.description);
      formData.append("groupImage", groupFile);
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

  return (
    <div>
      {user && (
        <section className="w-full mb-8">
          <button
            onClick={openModal}
            className="w-full bg-[#FEEFE8] text-secondary flex justify-center items-center gap-2 font-semibold px-5 py-3.5 rounded-xl border border-secondary transition cursor-pointer"
          >
            <BsStars size={24} />
            <span>Create New Group</span>
          </button>

          <CustomModal
            header={
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-800">
                  Create Group
                </h2>
                <button
                  className="text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
                  onClick={closeModal}
                >
                  <IoClose size={18} />
                </button>
              </div>
            }
            isOpen={isModalOpen}
            onClose={closeModal}
            className="w-full p-0 max-w-2xl"
          >
            <div className="p-3 space-y-4">
              {/* Group Image with Drag & Drop */}
              <div
                className={`w-full h-48 rounded-2xl relative flex items-center justify-center border-2 border-dashed transition-all duration-300 ${
                  isDragOver
                    ? "border-orange-400 bg-orange-50 scale-105"
                    : "border-gray-300 hover:border-orange-300 hover:bg-orange-25"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <AnimatePresence mode="wait">
                  {groupImage ? (
                    <div className="relative w-full h-full group">
                      <Image
                        src={groupImage}
                        alt="Group Image"
                        width={400}
                        height={200}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                        <label className="bg-white text-orange-600 rounded-full p-4 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200">
                          <BsCamera size={20} />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center h-full text-center">
                      <div
                        className={`p-5 rounded-full mb-4 transition-colors duration-300 ${
                          isDragOver ? "bg-orange-200" : "bg-gray-100"
                        }`}
                      >
                        <HiOutlinePhotograph
                          size={30}
                          className={`transition-colors duration-300 ${
                            isDragOver ? "text-orange-600" : "text-gray-500"
                          }`}
                        />
                      </div>
                      <h3
                        className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                          isDragOver ? "text-orange-700" : "text-gray-700"
                        }`}
                      >
                        {isDragOver
                          ? "Drop your amazing photo here!"
                          : "Add Group Photo"}
                      </h3>
                      <p className="text-gray-600 max-w-sm text-sm">
                        <span className="text-orange-600 font-semibold">
                          Click to browse
                        </span>{" "}
                        or drag and drop
                        <br />
                        High-quality images work best (JPG, PNG, GIF)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </AnimatePresence>
              </div>

              {/* Leader Info */}
              <div className="rounded-2xl p-3 mb-6 border border-gray-300/50">
                <div className="flex items-center gap-4">
                  {user && (
                    <div className="relative">
                      <Image
                        src={user?.profileImage}
                        alt="Leader"
                        width={60}
                        height={60}
                        className="size-[50px] object-cover rounded-full shadow-lg"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-gray-500 text-sm font-medium flex items-center gap-1">
                      Group Leader
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="flex flex-col gap-6 mt-5">
                  {/* Group Name */}
                  <CustomInput
                    type="text"
                    required
                    label="Group Name"
                    name="groupName"
                    placeholder="Group Name"
                    register={register("groupName")}
                    error={errors.groupName}
                  />
                  {/* Description with Character Counter */}
                  <div className="relative">
                    <CustomInput
                      type="textarea"
                      label="Group Description"
                      name="description"
                      isTextarea
                      required
                      placeholder="Group Description"
                      maxLength={395}
                      register={register("description")}
                      error={errors.description}
                    />
                  </div>

                  {/* Co-Leaders */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <h1 className="text-base font-semibold text-gray-900">
                        Add Co-Leaders
                      </h1>
                    </div>
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
                          {connection?.firstName} {connection?.lastName}
                        </Option>
                      ))}
                    </Select>
                    <p className="text-gray-600 text-sm">
                      Co-leaders can accept or decline once you&apos;ve
                      published your group.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <CustomButton
                    loading={isLoading}
                    type="submit"
                    fullWidth
                    className="px-5 py-3.5"
                  >
                    <span>Create Group</span>
                  </CustomButton>
                </div>
              </form>
            </div>
          </CustomModal>
        </section>
      )}
    </div>
  );
};

export default CreateGroup;
