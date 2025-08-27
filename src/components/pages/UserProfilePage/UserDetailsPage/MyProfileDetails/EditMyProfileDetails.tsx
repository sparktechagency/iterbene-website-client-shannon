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
import Image from "next/image"; // For rendering images in React components
import { FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
import { useState, ChangeEvent, useCallback } from "react";
import { BsUpload } from "react-icons/bs";
import Cropper from "react-easy-crop";
import type { Point, Area } from "react-easy-crop";
import CustomModal from "@/components/custom/custom-modal";

interface IEditMyProfileDetailsProps {
  userData: IUser;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

// Modal component for cropping
interface CropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImage: Blob) => void;
  aspectRatio: number;
  title: string;
}

const CropModal = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio,
  title,
}: CropModalProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const onCropCompleteHandler = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0,
    flip = { horizontal: false, vertical: false },
    filters = { brightness: 100, contrast: 100, saturation: 100 }
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Could not create canvas context");
    }

    const rotRad = (rotation * Math.PI) / 180;

    // Calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    // Set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // Translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // Apply filters
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`;

    // Draw rotated image
    ctx.drawImage(image, 0, 0);

    // Extract the cropped area
    const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    );

    // Set canvas width to final desired crop size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Clear and paste the cropped image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(data, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob(resolve as BlobCallback, "image/jpeg", 0.9);
    });
  };

  const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = (rotation * Math.PI) / 180;
    return {
      width:
        Math.abs(Math.cos(rotRad) * width) +
        Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) +
        Math.abs(Math.cos(rotRad) * height),
    };
  };

  const handleSaveCrop = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        { horizontal: false, vertical: false },
        { brightness, contrast, saturation }
      );
      onCropComplete(croppedImage as Blob);
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image");
    }
  };

  if (!isOpen) return null;

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      {" "}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="flex-1 flex">
        {/* Cropper Area */}
        <div className="flex-1 relative">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            style={{
              containerStyle: {
                filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
              },
            }}
          />
        </div>

        {/* Controls Panel */}
        <div className="w-80 p-4 border-l bg-gray-50 overflow-y-auto">
          <div className="space-y-6">
            {/* Zoom Control */}
            <div>
              <label className="block text-sm font-medium mb-2">Zoom</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{zoom.toFixed(1)}x</span>
            </div>

            {/* Rotation Control */}
            <div>
              <label className="block text-sm font-medium mb-2">Rotation</label>
              <input
                type="range"
                value={rotation}
                min={-180}
                max={180}
                step={1}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{rotation}°</span>
            </div>

            {/* Brightness Control */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Brightness
              </label>
              <input
                type="range"
                value={brightness}
                min={50}
                max={150}
                step={5}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{brightness}%</span>
            </div>

            {/* Contrast Control */}
            <div>
              <label className="block text-sm font-medium mb-2">Contrast</label>
              <input
                type="range"
                value={contrast}
                min={50}
                max={150}
                step={5}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{contrast}%</span>
            </div>

            {/* Saturation Control */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Saturation
              </label>
              <input
                type="range"
                value={saturation}
                min={0}
                max={200}
                step={10}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{saturation}%</span>
            </div>

            {/* Reset Button */}
            <CustomButton
              variant="outline"
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setBrightness(100);
                setContrast(100);
                setSaturation(100);
                setCrop({ x: 0, y: 0 });
              }}
              className="w-full"
            >
              Reset All
            </CustomButton>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="p-4 border-t flex justify-end gap-4">
        <CustomButton variant="outline" onClick={onClose}>
          Cancel
        </CustomButton>
        <CustomButton variant="default" onClick={handleSaveCrop}>
          Apply Changes
        </CustomButton>
      </div>
    </CustomModal>
  );
};

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

  // Crop modal states
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string>("");
  const [cropType, setCropType] = useState<"profile" | "cover">("profile");
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);

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
    type: "profile" | "cover"
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
        setCropImageSrc(reader.result as string);
        setOriginalImageFile(file);
        setCropType(type);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a valid SVG, PNG, JPG, or GIF image.");
    }
  };

  const handleCropComplete = (croppedImage: Blob) => {
    const croppedFile = new File(
      [croppedImage],
      originalImageFile?.name || `${cropType}_image.jpg`,
      {
        type: "image/jpeg",
      }
    );

    const reader = new FileReader();
    reader.onloadend = () => {
      if (cropType === "profile") {
        setProfileImagePreview(reader.result as string);
        setProfileImageFile(croppedFile);
      } else {
        setCoverImagePreview(reader.result as string);
        setCoverImageFile(croppedFile);
      }
    };
    reader.readAsDataURL(croppedFile);
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

  const handleEditImage = (type: "profile" | "cover") => {
    const imageSrc =
      type === "profile" ? profileImagePreview : coverImagePreview;
    if (imageSrc) {
      setCropImageSrc(imageSrc);
      setCropType(type);
      setIsCropModalOpen(true);
    }
  };

  return (
    <>
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="w-full col-span-2 border border-[#E2E8F0] shadow p-4">
          <div className="border-b border-[#E2E8F0] pb-4 mb-4">
            <h1 className="text-base md:text-lg font-semibold">
              Personal Information
            </h1>
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
                <label className="cursor-pointer">
                  <BsUpload size={28} className="text-secondary mx-auto" />
                  <p className="text-gray-600 mt-2 font-medium">
                    <span className="text-primary">Click to upload</span> or
                    drag and drop SVG, PNG, JPG or GIF
                    <br />
                    (max, 1640 x 856px)
                  </p>
                  <input
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg,image/gif"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "profile")}
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

          {/* Cover Photo Section */}
          <div className="border border-[#E2E8F0] shadow p-4">
            <div className="border-b border-[#E2E8F0] pb-4 mb-4">
              <h1 className="text-base md:text-xl font-semibold">
                Edit Your Cover Photo
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
            <div className="w-full border-2 p-6 border-dashed border-gray-400 rounded text-center relative">
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
                <label className="cursor-pointer">
                  <BsUpload size={28} className="text-secondary mx-auto" />
                  <p className="text-gray-600 mt-2 font-medium">
                    <span className="text-primary">Click to upload</span> or
                    drag and drop SVG, PNG, JPG or GIF
                    <br />
                    (max, 1640 x 856px)
                  </p>
                  <input
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg,image/gif"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "cover")}
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

      {/* Crop Modal */}
      <CropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={cropImageSrc}
        onCropComplete={handleCropComplete}
        aspectRatio={cropType === "profile" ? 1 : 16 / 9} // Square for profile, 16:9 for cover
        title={
          cropType === "profile" ? "Edit Profile Photo" : "Edit Cover Photo"
        }
      />
    </>
  );
};

export default EditMyProfileDetails;
