"use client";
import CustomInput from "@/components/custom/custom-input";
import CustomModal from "@/components/custom/custom-modal";
import Image from "next/image";
import React, { useState, DragEvent} from "react";
import { BsCamera } from "react-icons/bs";
import { HiOutlinePhotograph } from "react-icons/hi";
import { AnimatePresence } from "framer-motion";
import useUser from "@/hooks/useUser";
import { useCreateGroupMutation } from "@/redux/features/group/groupApi";
import { TError } from "@/types/error";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/custom/custom-button";
import { Users } from "lucide-react";


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
});

type GroupFormData = z.infer<typeof groupSchema>;

const CreateGroup: React.FC = () => {
  const user = useUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [groupFile, setGroupFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      groupName: "",
      description: ""
    },
  });

  // const { data: responseData } = useGetMyConnectionsQuery({
  //   page: 1,
  //   limit: 10,
  // });
  // const myConnections = responseData?.data?.attributes?.results;

  const [createGroup, { isLoading }] = useCreateGroupMutation();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setGroupFile(null);
    setGroupImage(null);
    setValue("groupName", "");
    setValue("description", "");
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
  // const filteredConnections =
  //   myConnections?.filter((connection: IMyConnections) => {
  //     const isNotSelected = !selectedMembers.some(
  //       (member) => member._id === connection._id
  //     );
  //     const matchesSearch =
  //       connection.firstName
  //         .toLowerCase()
  //         .includes(searchQuery.toLowerCase()) ||
  //       connection.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       connection.username.toLowerCase().includes(searchQuery.toLowerCase());
  //     return isNotSelected && matchesSearch;
  //   }) || [];

  // const handleMemberSelect = (member: IMyConnections) => {
  //   const newSelectedMembers = [...selectedMembers, member];
  //   setSelectedMembers(newSelectedMembers);
  //   const memberIds = newSelectedMembers.map((m) => m._id);
  //   setMembers(memberIds);
  //   setValue("members", memberIds);
  //   setSearchQuery("");
  // };

  // const handleMemberRemove = (memberId: string) => {
  //   const newSelectedMembers = selectedMembers.filter(
  //     (member) => member._id !== memberId
  //   );
  //   setSelectedMembers(newSelectedMembers);
  //   const memberIds = newSelectedMembers.map((m) => m._id);
  //   setMembers(memberIds);
  //   setValue("members", memberIds);
  // };

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
            <Users size={24} />
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


{
  /* 
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-gray-700">
                        Add Members{" "}
                        <span className="text-gray-400 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {selectedMembers.length} selected
                      </span>
                    </div>
                    {selectedMembers.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Users size={16} className="text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            Selected Members
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedMembers.map((member) => (
                            <div
                              key={member._id}
                              className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              <Image
                                src={
                                  member.profileImage || "/default-avatar.png"
                                }
                                alt={`${member.firstName} ${member.lastName}`}
                                width={24}
                                height={24}
                                className="size-6 rounded-full object-cover"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {member.firstName} {member.lastName}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleMemberRemove(member._id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-all duration-200"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="relative mb-8" ref={memberSearchRef} >
                      <button
                        type="button"
                        onClick={() => setShowMemberSearch(!showMemberSearch)}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 cursor-pointer border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                      >
                        <UserPlus
                          size={20}
                          className="text-gray-500 group-hover:text-primary transition-colors"
                        />
                        <span className="text-gray-600 group-hover:text-primary font-medium">
                          Add Members to Group
                        </span>
                      </button>

                      {showMemberSearch && (
                          <div className="p-4 border-b border-gray-100">
                            <div className="relative">
                              <CustomInput
                                type="text"
                                label="Search Members"
                                name="memberSearch"
                                icon={<Search size={18} />}
                                placeholder="Search Members"
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="max-h-48 overflow-y-auto">
                            {filteredConnections.length > 0 ? (
                              filteredConnections.map((connection:IConnection) => (
                                <button
                                  key={connection._id}
                                  type="button"
                                  onClick={() => handleMemberSelect(connection)}
                                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors duration-200 text-left"
                                >
                                  <Image
                                    src={
                                      connection.profileImage ||
                                      "/default-avatar.png"
                                    }
                                    alt={`${connection.firstName} ${connection.lastName}`}
                                    width={40}
                                    height={40}
                                    className="size-10 rounded-full object-cover"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {connection.firstName}{" "}
                                      {connection.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      @{connection.username}
                                    </p>
                                  </div>
                                  <UserPlus
                                    size={16}
                                    className="text-primary flex-shrink-0"
                                  />
                                </button>
                              ))
                            ) : (
                              <div className="p-6 text-center">
                                <Users
                                  size={32}
                                  className="mx-auto text-gray-300 mb-2"
                                />
                                <p className="text-sm text-gray-500">
                                  {searchQuery
                                    ? "No connections found matching your search"
                                    : "No available connections to add"}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="p-3 bg-gray-50 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => {
                                setShowMemberSearch(false);
                                setSearchQuery("");
                              }}
                              className="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
 </div> 
                  
                  
*/
}
