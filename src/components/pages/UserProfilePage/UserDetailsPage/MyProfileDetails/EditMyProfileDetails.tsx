import CustomButton from "@/components/custom/custom-button";
import CustomInput from "@/components/custom/custom-input";
import CustomSelectField from "@/components/custom/custom-seletectField";
import {
  useUpdateCoverImageMutation,
  useUpdateProfileImageMutation,
  useUpdateProfileMutation,
} from "@/redux/features/profile/profileApi";
import { IUser } from "@/types/user.types";
import Image from "next/image"; // For rendering images in React components
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState, ChangeEvent, useRef, DragEvent } from "react";
import ImageCropModal from "@/components/custom/ImageCropModal";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TError } from "@/types/error";
import { HiOutlinePhotograph } from "react-icons/hi";

interface IEditMyProfileDetailsProps {
  userData: IUser;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define the EditMyProfileDetails component
const editProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  nickname: z.string().optional().or(z.literal("")),
  username: z.string().min(1, "Username is required"),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  profession: z.string().min(1, "Profession is required"),
  // ✅ Required select fields:
  maritalStatus: z.string().min(1, "Relationship status is required"),
  referredAs: z.string().min(1, "Referred as is required"),
  ageRange: z.string().min(1, "Age range is required"),
});

type EditMyProfileDetailsFormData = z.infer<typeof editProfileSchema>;

const EditMyProfileDetails = ({
  userData,
  setEditMode,
}: IEditMyProfileDetailsProps) => {
  // Form states
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  // Image crop modal states
  const [showCoverCrop, setShowCoverCrop] = useState(false);
  const [showProfileCrop, setShowProfileCrop] = useState(false);
  const [coverImageSrc, setCoverImageSrc] = useState<string | null>(null);
  const [profileImageSrc, setProfileImageSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Drag and drop states
  const [isDragging, setIsDragging] = useState({
    profile: false,
    cover: false,
  });

  // File input refs
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditMyProfileDetailsFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      nickname: userData.nickname || "",
      username: userData.username || "",
      address: userData.address || "",
      phoneNumber: userData.phoneNumber || "",
      country: userData.country || "",
      city: userData.city || "",
      state: userData.state || "",
      profession: userData.profession || "",
      maritalStatus: userData.maritalStatus || "",
      referredAs: userData.referredAs || "",
      ageRange: userData.ageRange || "",
    },
  });

  //update profile mutation
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  //update profile image mutation
  const [updateProfileImage] = useUpdateProfileImageMutation();

  //update cover image mutation
  const [updateCoverImage] = useUpdateCoverImageMutation();

  const handleEditProfileInformation = async (values: FieldValues) => {
    try {
      const res = await updateProfile(values).unwrap();
      toast.success(res?.message);
      setEditMode(false);
    } catch (error) {
      const err = error as Error;
      toast.error(err?.message || "Something went wrong!");
    }
  };

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file, type);
    }
    // Reset input value
    e.target.value = "";
  };

  const handleFileSelection = (file: File, type: "profile" | "cover") => {
    if (
      file &&
      [
        "image/svg+xml",
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp",
      ].includes(file.type)
    ) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageSrc = reader.result as string;
        if (type === "cover") {
          setCoverImageSrc(imageSrc);
          setShowCoverCrop(true);
        } else {
          setProfileImageSrc(imageSrc);
          setShowProfileCrop(true);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a valid SVG, PNG, JPG, WEBP, or GIF image.");
    }
  };

  // Drag and drop handlers
  const handleDragOver = (
    e: DragEvent<HTMLDivElement>,
    type: "profile" | "cover"
  ) => {
    e.preventDefault();
    setIsDragging((prev) => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (
    e: DragEvent<HTMLDivElement>,
    type: "profile" | "cover"
  ) => {
    e.preventDefault();
    setIsDragging((prev) => ({ ...prev, [type]: false }));
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    type: "profile" | "cover"
  ) => {
    e.preventDefault();
    setIsDragging((prev) => ({ ...prev, [type]: false }));

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0], type);
    }
  };

  // Image crop handlers
  const handleCoverCropComplete = async (croppedImage: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("coverImage", croppedImage);

      const res = await updateCoverImage(formData).unwrap();
      toast.success(res?.message || "Cover photo updated successfully!");
      setShowCoverCrop(false);
      setCoverImageSrc(null);
      setCoverImagePreview(null);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileCropComplete = async (croppedImage: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profileImage", croppedImage);

      const res = await updateProfileImage(formData).unwrap();
      toast.success(res?.message || "Profile photo updated successfully!");
      setShowProfileCrop(false);
      setProfileImageSrc(null);
      setProfileImagePreview(null);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCropCancel = (type: "cover" | "profile") => {
    if (type === "cover") {
      setShowCoverCrop(false);
      setCoverImageSrc(null);
    } else {
      setShowProfileCrop(false);
      setProfileImageSrc(null);
    }
  };

  const handleEditImage = (type: "profile" | "cover") => {
    const imageSrc =
      type === "profile" ? profileImagePreview : coverImagePreview;
    console.log("imageSrc", imageSrc);
  };


  console.log("Eerrors", errors);
  return (
    <>
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="w-full col-span-2 border border-[#E2E8F0] shadow p-4">
          <div className="border-b border-[#E2E8F0] pb-4 mb-4">
            <h1 className="text-base md:text-lg font-semibold">
              Personal Information
            </h1>
          </div>
          <form onSubmit={handleSubmit(handleEditProfileInformation)}>
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
                name="nickname"
                placeholder="Enter your nick name"
                label="Nick Name"
                register={register("nickname")}
                error={errors.nickname}
              />
              <CustomInput
                type="text"
                name="username"
                required
                placeholder="Enter your username"
                label="Username"
                register={register("username")}
                error={errors.username}
              />
              <CustomInput
                type="text"
                required
                name="address"
                placeholder="Enter your address"
                label="Address"
                register={register("address")}
                error={errors.address}
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
              <CustomInput
                type="text"
                name="country"
                required
                placeholder="Enter your country"
                label="Country"
                register={register("country")}
                error={errors.country}
              />
              <CustomInput
                type="text"
                name="city"
                required
                placeholder="Enter your city"
                label="City"
                register={register("city")}
                error={errors.city}
              />
              <CustomInput
                type="text"
                required
                name="state"
                placeholder="Enter your state"
                label="State"
                register={register("state")}
                error={errors.state}
              />
              <CustomSelectField
                items={[
                  { label: "Divorced", value: "Divorced" },
                  {
                    label: "Domestic Partnership",
                    value: "Domestic Partnership",
                  },
                  { label: "Engaged", value: "Engaged" },
                  { label: "In a relationship", value: "In a relationship" },
                  { label: "It's Complicated", value: "It's Complicated" },
                  { label: "Looking", value: "Looking" },
                  {
                    label: "Married with child/children",
                    value: "Married with child/children",
                  },
                  { label: "Single", value: "Single" },
                  { label: "Widowed", value: "Widowed" },
                ]}
                required
                name="maritalStatus"
                label="Relationship Status"
                size="md"
                placeholder="What is your marital status"
                register={register("maritalStatus")}
                defaultValue={userData?.maritalStatus}
                error={errors.maritalStatus}
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
                placeholder="How did you know about us"
                register={register("referredAs")}
                defaultValue={userData?.referredAs}
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
            </div>
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <CustomButton
                type="button"
                variant="outline"
                onClick={() => setEditMode(false)}
                className="px-9 py-3"
                fullWidth
              >
                Cancel
              </CustomButton>
              <CustomButton
                loading={isLoading}
                type="submit"
                variant="default"
                className="px-9 py-3"
                fullWidth
              >
                Save
              </CustomButton>
            </div>
          </form>
        </div>

        <div className="w-full col-span-1 space-y-8">
          {/* Profile Photo Section */}
          <div className="border border-[#E2E8F0] shadow p-4">
            <div className="border-b border-[#E2E8F0] pb-4 mb-4">
              <h1 className="text-base md:text-xl font-semibold">Your Photo</h1>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={userData?.profileImage || ""}
                width={50}
                height={50}
                alt="profile"
                className="size-[50px] rounded-full object-cover ring-2 ring-gray-400"
              />
              <h1 className="text-base md:text-lg">Edit Your Profile Photo</h1>
            </div>
            <div
              className={`w-full h-52 rounded-2xl relative flex items-center justify-center border-2 border-dashed transition-all duration-300 border-gray-300 hover:border-orange-300 hover:bg-orange-25`}
              onDragOver={(e) => handleDragOver(e, "profile")}
              onDragLeave={(e) => handleDragLeave(e, "profile")}
              onDrop={(e) => handleDrop(e, "profile")}
            >
              {profileImagePreview ? (
                <div className="relative">
                  <Image
                    src={profileImagePreview}
                    width={100}
                    height={100}
                    alt="Profile Preview"
                    className="w-full h-[100px] object-contain rounded"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEditImage("profile")}
                      className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
                      title="Edit Image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <label
                      className="bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/90"
                      title="Replace Image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <input
                        type="file"
                        accept="image/svg+xml,image/png,image/jpeg,image/gif"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "profile")}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center h-full text-center">
                  <div
                    className={`p-5 rounded-full mb-4 transition-colors duration-300 ${
                      isDragging.profile ? "bg-orange-200" : "bg-gray-100"
                    }`}
                  >
                    <HiOutlinePhotograph
                      size={30}
                      className={`transition-colors duration-300 ${
                        isDragging.profile ? "text-orange-600" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                      isDragging.profile ? "text-orange-700" : "text-gray-700"
                    }`}
                  >
                    {isDragging.profile
                      ? "Drop your amazing photo here!"
                      : "Add Your Profile Photo"}
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
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "profile")}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Cover Photo Section */}
          <div className="border border-[#E2E8F0] shadow p-4">
            <div className="border-b border-[#E2E8F0] pb-4 mb-4">
              <h1 className="text-base md:text-xl font-semibold">
                Your Cover Photo
              </h1>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={userData?.coverImage || ""}
                width={50}
                height={50}
                alt="cover"
                className="size-[50px] rounded-full object-cover ring-2 ring-gray-400"
              />
              <h1 className="text-base md:text-lg">Edit Your Cover Photo</h1>
            </div>
            <div
              className={`w-full h-52 rounded-2xl relative flex items-center justify-center border-2 border-dashed transition-all duration-300 border-gray-300 hover:border-orange-300 hover:bg-orange-25`}
              onDragOver={(e) => handleDragOver(e, "cover")}
              onDragLeave={(e) => handleDragLeave(e, "cover")}
              onDrop={(e) => handleDrop(e, "cover")}
            >
              {coverImagePreview ? (
                <div className="relative">
                  <Image
                    src={coverImagePreview}
                    width={100}
                    height={100}
                    alt="Cover Preview"
                    className="w-full h-[100px] object-contain rounded"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEditImage("cover")}
                      className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
                      title="Edit Image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <label
                      className="bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/90"
                      title="Replace Image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <input
                        type="file"
                        accept="image/svg+xml,image/png,image/jpeg,image/gif"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "cover")}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center h-full text-center">
                  <div
                    className={`p-5 rounded-full mb-4 transition-colors duration-300 ${
                      isDragging.profile ? "bg-orange-200" : "bg-gray-100"
                    }`}
                  >
                    <HiOutlinePhotograph
                      size={30}
                      className={`transition-colors duration-300 ${
                        isDragging.profile ? "text-orange-600" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                      isDragging.profile ? "text-orange-700" : "text-gray-700"
                    }`}
                  >
                    {isDragging.profile
                      ? "Drop your amazing photo here!"
                      : "Add Your Cover Photo"}
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
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "cover")}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image Crop Modals */}
      <ImageCropModal
        isOpen={showCoverCrop}
        onClose={() => handleCropCancel("cover")}
        imageSrc={coverImageSrc || ""}
        onCropComplete={handleCoverCropComplete}
        cropShape="rect"
        aspect={3 / 1}
        title="Crop Cover Photo"
        isUploading={isUploading}
        isProfile={false}
      />
      <ImageCropModal
        isOpen={showProfileCrop}
        onClose={() => handleCropCancel("profile")}
        imageSrc={profileImageSrc || ""}
        onCropComplete={handleProfileCropComplete}
        cropShape="round"
        aspect={1}
        title="Crop Profile Photo"
        isUploading={isUploading}
        isProfile={true}
      />
    </>
  );
};

export default EditMyProfileDetails;
