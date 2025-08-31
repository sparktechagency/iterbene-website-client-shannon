"use client";
import CustomInput from "@/components/custom/custom-input";
import CustomModal from "@/components/custom/custom-modal";
import CustomDatePicker from "@/components/custom/CustomDatePicker";
import Image from "next/image";
import React, { useState, DragEvent } from "react";
import { BsCamera, BsStars } from "react-icons/bs";
import { HiOutlinePhotograph } from "react-icons/hi";
import { AnimatePresence } from "framer-motion";
import LocationSearchInput from "@/components/custom/LocationSearchInput";
import { LocationDetails } from "@/hooks/useGoogleLocationSearch";
import useUser from "@/hooks/useUser";
import { useCreateEventMutation } from "@/redux/features/event/eventApi";
import { TError } from "@/types/error";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import CustomButton from "@/components/custom/custom-button";

// Define Zod schema for form validation
const eventSchema = z
  .object({
    eventName: z
      .string()
      .min(1, "Event Name is required")
      .max(100, "Event Name must be 100 characters or less"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description must be 500 characters or less"),
    startDate: z
      .string()
      .min(1, "Start Date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start Date must be a valid date"),
    endDate: z
      .string()
      .min(1, "End Date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "End Date must be a valid date"),
    location: z.string().min(1, "Event Location is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: "End Date must be on or after Start Date",
      path: ["endDate"],
    }
  );

type EventFormData = z.infer<typeof eventSchema>;

const CreateEvent: React.FC = () => {
  const user = useUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [eventImage, setEventImage] = useState<string | null>(null);
  const [eventFile, setEventFile] = useState<File | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationDetails | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventName: "Rakib",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
    },
  });

  const [createEvent, { isLoading }] = useCreateEventMutation();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // Reset states when modal closes
    setSelectedLocation(null);
    setEventFile(null);
    setEventImage(null);
    setValue("eventName", "");
    setValue("description", "");
    setValue("startDate", "");
    setValue("endDate", "");
    setValue("location", "");
    setIsDragOver(false);
  };

  const processImageFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      // Revoke the previous object URL to prevent memory leaks
      if (eventImage) {
        URL.revokeObjectURL(eventImage);
      }
      const imageUrl = URL.createObjectURL(file);
      setEventImage(imageUrl);
      setEventFile(file);
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

  const handleFormSubmit = async (values: EventFormData) => {
    // Validate location selection
    if (!selectedLocation) {
      toast.error("Please select a valid location");
      return;
    }
    if (!eventFile) {
      toast.error("Please upload an event image");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("eventName", values.eventName);
      formData.append("description", values.description);
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);
      formData.append(
        "location",
        JSON.stringify({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        })
      );
      formData.append("locationName", selectedLocation.name);
      formData.append("eventImage", eventFile);
      await createEvent(formData).unwrap();
      toast.success("Event created successfully!");
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
            <span>Create New Event</span>
          </button>
          {/* Render the Modal */}
          <CustomModal
            header={
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-800">
                  Create Event
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
              {/* Event Image with Drag & Drop */}
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
                  {eventImage ? (
                    <div className="relative w-full h-full group">
                      <Image
                        src={eventImage}
                        alt="Event Image"
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
                          : "Add Event Photo"}
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
                      Event Organizer
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="flex flex-col gap-6 mt-5">
                  {/* Event Name */}
                  <CustomInput
                    type="text"
                    required
                    label="Event Name"
                    name="eventName"
                    placeholder="Event Name"
                    register={register("eventName")}
                    error={errors.eventName}
                  />

                  {/* Start Date */}
                  <CustomDatePicker
                    label="Start Date"
                    name="startDate"
                    register={register("startDate")}
                    error={errors.startDate}
                    placeholder="Start Date"
                    required
                    onChange={(value) => setValue("startDate", value)}
                  />

                  {/* End Date */}
                  <CustomDatePicker
                    label="End Date"
                    name="endDate"
                    register={register("endDate")}
                    error={errors.endDate}
                    placeholder="End Date"
                    required
                    onChange={(value) => setValue("endDate", value)}
                  />

                  {/* Event Cost */}
                  {/* <CustomInput
                    type="text"
                    icon={
                      <HiOutlineCurrencyDollar
                        size={20}
                        className="text-gray-400"
                      />
                    }
                    label="Event Cost($)"
                    name="eventCost"
                    placeholder="Event Cost"
                    register={register("eventCost")}
                    error={errors.eventCost}
                  /> */}

                  {/* Event Location */}
                  <LocationSearchInput
                    label="Event Location"
                    name="location"
                    placeholder="Event Location"
                    onLocationSelect={(location) => {
                      setSelectedLocation(location);
                      setValue("location", location.name);
                    }}
                    required
                    showSelectedInfo={false}
                    register={register("location")}
                    error={errors.location}
                  />

                  {/* Event Description */}
                  <CustomInput
                    type="textarea"
                    label="Event Description"
                    name="description"
                    isTextarea
                    required
                    placeholder="Event Description"
                    maxLength={500}
                    register={register("description")}
                    error={errors.description}
                  />

                  {/* Submit Button */}
                  <CustomButton
                    loading={isLoading}
                    type="submit"
                    fullWidth
                    className="px-5 py-3.5"
                  >
                    <span>Create Event</span>
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

export default CreateEvent;
