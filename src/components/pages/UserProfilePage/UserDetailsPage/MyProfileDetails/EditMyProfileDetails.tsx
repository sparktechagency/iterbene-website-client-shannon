import CustomButton from "@/components/custom/custom-button";
import CustomForm from "@/components/custom/custom-form";
import CustomInput from "@/components/custom/custom-input";
import CustomSelectField from "@/components/custom/custom-seletectField";
import {
  useUpdateCoverImageMutation,
  useUpdateProfileImageMutation,
  useUpdateProfileMutation,
} from "@/redux/features/profile/profileApi";
import { IUser } from "@/types/user.types";
import { editProfileValidationSchema } from "@/validation/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
import { useState, ChangeEvent } from "react";
import { BsUpload } from "react-icons/bs";

interface IEditMyProfileDetailsProps {
  userData: IUser;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditMyProfileDetails = ({
  userData,
  setEditMode,
}: IEditMyProfileDetailsProps) => {
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  //update profile mutation
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  //update profile image mutation
  const [updateProfileImage, { isLoading: isUpdatingProfileImage }] =
    useUpdateProfileImageMutation();

  //update cover image mutation
  const [updateCoverImage, { isLoading: isUpdatingCoverImage }] =
    useUpdateCoverImageMutation();
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
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (
      file &&
      ["image/svg+xml", "image/png", "image/jpeg", "image/gif"].includes(
        file.type
      )
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setFile(file);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a valid SVG, PNG, JPG, or GIF image.");
    }
  };

  const handleUpdateProfileImage = async () => {
    if (profileImageFile) {
      const formData = new FormData();
      formData.append("profileImage", profileImageFile);
      try {
        const res = await updateProfileImage(formData).unwrap();
        toast.success(res?.message);
        setProfileImagePreview(null);
        setProfileImageFile(null);
      } catch (error) {
        const err = error as Error;
        toast.error(err?.message || "Something went wrong!");
      }
    }
  };

  const handleUpdateCoverImage = async () => {
    if (coverImageFile) {
      const formData = new FormData();
      formData.append("coverImage", coverImageFile);
      try {
        const res = await updateCoverImage(formData).unwrap();
        toast.success(res?.message);
        setCoverImagePreview(null);
        setCoverImageFile(null);
      } catch (error) {
        const err = error as Error;
        toast.error(err?.message || "Something went wrong!");
      }
    }
  };

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <div className="w-full col-span-2 border border-[#E2E8F0] shadow p-4">
        <div className="border-b border-[#E2E8F0] pb-4 mb-4">
          <h1 className="text-xl font-semibold">Personal Information</h1>
        </div>
        <CustomForm
          onSubmit={handleEditProfileInformation}
          defaultValues={userData}
          resolver={zodResolver(editProfileValidationSchema)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              type="text"
              required
              name="fullName"
              placeholder="Enter your full name"
              label="Full Name"
            />
            <CustomInput
              type="text"
              name="nickname"
              placeholder="Enter your nick name"
              label="Nick Name"
            />
            <CustomInput
              type="text"
              name="username"
              required
              placeholder="Enter your username"
              label="Username"
            />
            <CustomInput
              type="text"
              required
              name="address"
              placeholder="Enter your address"
              label="Address"
            />
            <CustomInput
              type="text"
              required
              name="phoneNumber"
              placeholder="Enter your phone number"
              label="Phone Number"
            />
            <CustomInput
              type="text"
              name="country"
              required
              placeholder="Enter your country"
              label="Country"
            />
            <CustomInput
              type="text"
              name="city"
              required
              placeholder="Enter your city"
              label="City"
            />
            <CustomInput
              type="text"
              required
              name="state"
              placeholder="Enter your state"
              label="State"
            />
            <CustomSelectField
              items={["He/Him", "She/Her", "They/Them", "Undisclosed"]}
              name="referredAs"
              label="Referred As"
              size="md"
              required
              placeholder="How did you know about us"
            />
            <CustomSelectField
              items={[
                "13-17",
                "18-24",
                "25-34",
                "35-44",
                "45-54",
                "55-64",
                "65+",
              ]}
              name="ageRange"
              label="Age Range"
              size="md"
              required
              placeholder="Select your age range"
            />
            <CustomInput
              type="text"
              name="profession"
              required
              placeholder="Enter your profession"
              label="Profession"
            />
            <CustomSelectField
              items={[
                "Divorced",
                "Domestic Partnership",
                "Engaged",
                "In a Relationship",
                "It's Complicated",
                "Looking",
                "Married",
                "Married with child/children",
                "Single",
                "Undisclosed",
                "Widowed",
              ]}
              required
              name="maritalStatus"
              label="Relationship Status"
              size="md"
              placeholder="What is your marital status"
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
        </CustomForm>
      </div>
      <div className="w-full col-span-1 space-y-8">
        <div className="border border-[#E2E8F0] shadow p-4">
          <div className="border-b border-[#E2E8F0] pb-4 mb-4">
            <h1 className="text-xl font-semibold">Your Photo</h1>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Image
              src={userData?.profileImage || ""}
              width={50}
              height={50}
              alt="profile"
              className="size-[50px] rounded-full object-cover ring-2 ring-gray-400"
            />
            <h1 className="text-lg">Edit Your Profile Photo</h1>
          </div>
          <div className="w-full border-2 p-6 border-dashed border-gray-400 rounded text-center relative">
            {profileImagePreview ? (
              <div className="relative">
                <Image
                  src={profileImagePreview}
                  width={100}
                  height={100}
                  alt="Profile Preview"
                  className="w-full h-[100px] object-contain rounded"
                />
                <label className="absolute top-2 right-2 bg-primary text-white rounded-full p-2 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg,image/gif"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(
                        e,
                        setProfileImagePreview,
                        setProfileImageFile
                      )
                    }
                  />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer">
                <BsUpload size={28} className="text-secondary mx-auto" />
                <p className="text-gray-600 mt-2 font-medium">
                  <span className="text-primary">Click to upload</span> or drag
                  and drop SVG, PNG, JPG or GIF
                  <br />
                  (max, 1640 x 856px)
                </p>
                <input
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg,image/gif"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(
                      e,
                      setProfileImagePreview,
                      setProfileImageFile
                    )
                  }
                />
              </label>
            )}
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <CustomButton
              variant="outline"
              className="px-6 py-2"
              onClick={() => {
                setProfileImagePreview(null);
                setProfileImageFile(null);
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="default"
              className="px-6 py-2 bg-orange-500 text-white"
              onClick={handleUpdateProfileImage}
              loading={isUpdatingProfileImage}
            >
              Save
            </CustomButton>
          </div>
        </div>
        <div className="border border-[#E2E8F0] shadow p-4">
          <div className="border-b border-[#E2E8F0] pb-4 mb-4">
            <h1 className="text-xl font-semibold">Edit Your Cover Photo</h1>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Image
              src={userData?.coverImage || ""}
              width={50}
              height={50}
              alt="cover"
              className="size-[50px] rounded-full object-cover ring-2 ring-gray-400"
            />
            <h1 className="text-lg">Edit Your Cover Photo</h1>
          </div>
          <div className="w-full border-2 p-6 border-dashed border-gray-400 rounded text-center relative">
            {coverImagePreview ? (
              <div className="relative">
                <Image
                  src={coverImagePreview}
                  width={100}
                  height={100}
                  alt="Profile Preview"
                  className="w-full h-[100px] object-contain rounded"
                />
                <label className="absolute top-2 right-2 bg-primary text-white rounded-full p-2 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg,image/gif"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(
                        e,
                        setCoverImagePreview,
                        setCoverImageFile
                      )
                    }
                  />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer">
                <BsUpload size={28} className="text-secondary mx-auto" />
                <p className="text-gray-600 mt-2 font-medium">
                  <span className="text-primary">Click to upload</span> or drag
                  and drop SVG, PNG, JPG or GIF
                  <br />
                  (max, 1640 x 856px)
                </p>
                <input
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg,image/gif"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(
                      e,
                      setCoverImagePreview,
                      setCoverImageFile
                    )
                  }
                />
              </label>
            )}
          </div>
          <div className="mt-4 flex justify-end gap-4">
            <CustomButton
              variant="outline"
              className="px-6 py-2"
              onClick={() => {
                setCoverImagePreview(null);
                setCoverImageFile(null);
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="default"
              onClick={handleUpdateCoverImage}
              loading={isUpdatingCoverImage}
              className="px-6 py-2 bg-orange-500 text-white"
            >
              Save
            </CustomButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditMyProfileDetails;
