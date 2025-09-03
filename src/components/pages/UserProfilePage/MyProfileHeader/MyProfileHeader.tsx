import { IUser } from "@/types/user.types";
import { getFullName } from "@/utils/nameUtils";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef } from "react";
import ImageCropModal from "@/components/custom/ImageCropModal";
import { useUpdateProfileImageMutation, useUpdateCoverImageMutation } from "@/redux/features/profile/profileApi";
import toast from "react-hot-toast";

const MyProfileHeader = ({ userData }: { userData: IUser }) => {
  const [showCoverCrop, setShowCoverCrop] = useState(false);
  const [showProfileCrop, setShowProfileCrop] = useState(false);
  const [coverImageSrc, setCoverImageSrc] = useState<string | null>(null);
  const [profileImageSrc, setProfileImageSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const [updateProfileImage] = useUpdateProfileImageMutation();
  const [updateCoverImage] = useUpdateCoverImageMutation();

  const handleImageSelect = (type: "cover" | "profile") => {
    const inputRef = type === "cover" ? coverInputRef : profileInputRef;
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "cover" | "profile") => {
    const file = event.target.files?.[0];
    if (file) {
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
    }
    event.target.value = "";
  };

  const handleCoverCropComplete = async (croppedImage: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("coverImage", croppedImage);

      await updateCoverImage(formData).unwrap();
      toast.success("Cover photo updated successfully!");
      setShowCoverCrop(false);
      setCoverImageSrc(null);
    } catch (error: unknown) {
      console.error("Error uploading cover image:", error);
      const errorMessage =
        error && typeof error === "object" && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
          ? String(error.data.message)
          : "Failed to update cover photo. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileCropComplete = async (croppedImage: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profileImage", croppedImage);

      await updateProfileImage(formData).unwrap();
      toast.success("Profile photo updated successfully!");
      setShowProfileCrop(false);
      setProfileImageSrc(null);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error && error.data && typeof error.data === "object" && "message" in error.data
          ? String(error.data.message)
          : "Failed to update profile photo. Please try again.";
      toast.error(errorMessage);
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

  return (
    <>
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, "cover")}
      />
      <input
        ref={profileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, "profile")}
      />

      <div className="w-full bg-white rounded-2xl relative mt-[72px] md:mt-[88px] lg:mt-[112px]">
        {/* Background Image with Camera Icon */}
        <div className="relative group w-full">
          <div className="relative w-full h-[200px] sm:h-[280px] md:h-[360px] overflow-hidden rounded-t-2xl">
            {userData?.coverImage ? (
              <Image
                src={userData?.coverImage || ""}
                alt="Cover photo"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-t-2xl flex items-center justify-center">
                <div className="text-gray-500 text-center">
                  <CameraIcon className="w-12 h-12 mx-auto mb-2 opacity-70" />
                </div>
              </div>
            )}
          </div>
          <div className="absolute bottom-5 right-6 bg-black/10 rounded-full bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center cursor-pointer">
            <button
              onClick={() => handleImageSelect("cover")}
              className="bg-white/90 backdrop-blur-2xl p-2 rounded-full shadow-lg border border-gray-200 cursor-pointer flex items-center gap-2"
            >
              <CameraIcon className="size-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Profile Image with Camera Icon */}
        <div className="relative group inline-block">
          <div className="relative lg:absolute left-8 -mt-[80px] lg:-mt-[100px] mx-auto">
            <div className="relative size-[140px] md:size-[174px] lg:size-[174px] border-4 border-white rounded-full overflow-hidden shadow-lg">
              {userData?.profileImage? (
                <Image
                  src={userData?.profileImage}
                  alt="Profile photo"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 140px, (max-width: 1024px) 174px, 174px"
                />
              ) : (
                <div className="size-[140px] md:size-[174px] lg:size-[174px] bg-gradient-to-br from-primary to-secondary rounded-full border-4 border-white flex-shrink-0 shadow-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <CameraIcon className="w-8 h-8 mx-auto mb-1" />
                  </div>
                </div>
              )}
            </div>
            <div className="absolute bg-black/10 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-full bottom-5 right-0">
              <button
                onClick={() => handleImageSelect("profile")}
                className="transition-all duration-300 cursor-pointer bg-white bg-opacity-95 hover:bg-opacity-100 p-2 rounded-full shadow-lg backdrop-blur-sm border border-gray-200 transform"
              >
                <CameraIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 lg:pl-[240px] p-7 md:p-10">
          <div className="space-y-1">
            <h1 className="text-center md:text-left text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
              {getFullName(userData)}
            </h1>
            <div className="flex flex-wrap gap-2 sm:gap-3 text-gray-600 text-sm md:text-base font-medium">
              <span>@{userData?.username}</span>
              <span>· {userData?.followersCount} followers</span>
              <span>· {userData?.followingCount} following</span>
            </div>
          </div>
        </div>
      </div>

      <ImageCropModal
        isOpen={showCoverCrop}
        onClose={() => handleCropCancel("cover")}
        imageSrc={coverImageSrc || ""}
        onCropComplete={handleCoverCropComplete}
        cropShape="rect"
        aspect={8000 / 3000} // Adjusted aspect ratio to match typical cover photo dimensions
        title="Crop Cover Photo"
        isUploading={isUploading}
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
      />
    </>
  );
};

export default MyProfileHeader;