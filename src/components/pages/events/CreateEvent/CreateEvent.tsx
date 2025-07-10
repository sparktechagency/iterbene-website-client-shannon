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
import { DollarSignIcon, Lock } from "lucide-react";
import CustomButton from "@/components/custom/custom-button";
import { IoClose } from "react-icons/io5";
import useUser from "@/hooks/useUser";
import { TError } from "@/types/error";
import toast from "react-hot-toast";
import { LocationDetails } from "@/hooks/useGoogleLocationSearch";
import LocationSearchInput from "@/components/custom/LocationSearchInput";
import { useCreateEventMutation } from "@/redux/features/event/eventApi";
import { zodResolver } from "@hookform/resolvers/zod";
import eventValidationSchema from "@/validation/event.validation";

const CreateEvent: React.FC = () => {
  const user = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventImage, setEventImage] = useState<string | null>(null);
  const [eventFile, setEventFile] = useState<File | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationDetails | null>(null);
  const [duration, setDuration] = useState({ days: 1, nights: 0 });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // Reset states when modal closes
    setSelectedLocation(null);
    setEventFile(null);
    setEventImage(null);
    setDuration({ days: 1, nights: 0 });
  };

  // Create group mutation
  const [createEvent, { isLoading }] = useCreateEventMutation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke the previous object URL to prevent memory leaks
      if (eventImage) {
        URL.revokeObjectURL(eventImage);
      }
      const imageUrl = URL.createObjectURL(file);
      setEventImage(imageUrl);
      setEventFile(file);
    }
  };

  const handleLocationSelect = (location: LocationDetails) => {
    setSelectedLocation(location);
  };

  const handleDurationChange = (type: "days" | "nights", value: number) => {
    setDuration((prev) => ({
      ...prev,
      [type]: Math.max(0, value),
    }));
  };

  const formatDurationString = () => {
    const { days, nights } = duration;
    const parts = [];
    if (days > 0) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
    if (nights > 0)
      parts.push(`${nights} ${nights === 1 ? "night" : "nights"}`);
    return parts.length > 0 ? parts.join(" ") : "1 day";
  };

  const handleFormSubmit = async (values: FieldValues) => {
    // Validate location selection
    if (!selectedLocation) {
      toast.error("Please select a valid location");
      return;
    }
    if (!eventFile) {
      toast.error("Please upload an event image");
      return;
    }
    // Validate duration

    try {
      const formData = new FormData();
      formData.append("eventName", values.eventName);
      formData.append("description", values.description);
      formData.append("privacy", values.privacy);
      formData.append("startDate", values.startDate);
      formData.append("endDate", values.endDate);
      formData.append(
        "duration",
        JSON.stringify({
          days: duration.days,
          nights: duration.nights,
        })
      );
      formData.append(
        "location",
        JSON.stringify({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        })
      );
      formData.append("locationName", selectedLocation.name);
      formData.append("eventImage", eventFile || "");
      formData.append("eventCost", values.eventCost);
      await createEvent(formData).unwrap();
      toast.success("Event created successfully!");
      closeModal();
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
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
            {/* Event Image */}
            <div className="w-full h-44 bg-[#DDDDDD] rounded-xl mb-4 relative flex items-center justify-center">
              {eventImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={eventImage}
                    alt="Event Image"
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
                    Upload event image
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
                <p className="text-gray-500 text-sm">Leader</p>
              </div>
            </div>

            {/* Form */}
            <CustomForm
              onSubmit={handleFormSubmit}
              resolver={zodResolver(eventValidationSchema)}
            >
              <div className="flex flex-col gap-6 mt-8">
                <CustomInput
                  type="text"
                  required
                  label="Event Name"
                  name="eventName"
                  placeholder="Event name"
                />

                {/* Start Date */}
                <CustomInput
                  type="datetime-local"
                  required
                  label="Start Date"
                  name="startDate"
                  placeholder="Select start date and time"
                />

                {/* End Date */}
                <CustomInput
                  type="datetime-local"
                  required
                  label="End Date"
                  name="endDate"
                  placeholder="Select end date and time"
                />

                {/* Duration */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="bg-white border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">
                        Event Duration:
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {formatDurationString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Days Counter */}
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium text-gray-700 mb-2">
                          Days
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleDurationChange("days", duration.days - 1)
                            }
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                            disabled={duration.days <= 0}
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold text-lg">
                            {duration.days}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleDurationChange("days", duration.days + 1)
                            }
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Nights Counter */}
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium text-gray-700 mb-2">
                          Nights
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleDurationChange(
                                "nights",
                                duration.nights - 1
                              )
                            }
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                            disabled={duration.nights <= 0}
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold text-lg">
                            {duration.nights}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleDurationChange(
                                "nights",
                                duration.nights + 1
                              )
                            }
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quick presets */}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setDuration({ days: 1, nights: 0 })}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            duration.days === 1 && duration.nights === 0
                              ? "bg-blue-100 border-blue-300 text-blue-700"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          1 Day
                        </button>
                        <button
                          type="button"
                          onClick={() => setDuration({ days: 2, nights: 1 })}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            duration.days === 2 && duration.nights === 1
                              ? "bg-blue-100 border-blue-300 text-blue-700"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          2 Days 1 Night
                        </button>
                        <button
                          type="button"
                          onClick={() => setDuration({ days: 3, nights: 2 })}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            duration.days === 3 && duration.nights === 2
                              ? "bg-blue-100 border-blue-300 text-blue-700"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          3 Days 2 Nights
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Event Cost */}
                <CustomInput
                  type="number"
                  icon={<DollarSignIcon size={22} className="text-[#9194A9]" />}
                  label="Event Cost($)"
                  name="eventCost"
                  placeholder="Enter event cost (200$)"
                  required
                />

                {/* Reusable Location Search Component */}
                <LocationSearchInput
                  label="Location"
                  placeholder="Search for a location..."
                  required
                  onLocationSelect={handleLocationSelect}
                  showSelectedInfo={false}
                />

                {/* Who can see the event? */}
                <CustomSelectField
                  items={[
                    { label: "Public", value: "public" },
                    { label: "Private", value: "private" },
                  ]}
                  label="Who can see the event?"
                  icon={<Lock size={22} className="text-[#9194A9]" />}
                  placeholder="Who can see the event?"
                  name="privacy"
                  required
                />

                {/* Description */}
                <CustomInput
                  type="textarea"
                  label="Description"
                  name="description"
                  isTextarea
                  placeholder="What are the details?"
                  required
                />

                <CustomButton
                  loading={isLoading}
                  type="submit"
                  className="px-5 py-3.5 rounded-xl border  transition cursor-pointer"
                >
                  <span>Create Event</span>
                </CustomButton>
              </div>
            </CustomForm>
          </CustomModal>
        </section>
      )}
    </>
  );
};

export default CreateEvent;
