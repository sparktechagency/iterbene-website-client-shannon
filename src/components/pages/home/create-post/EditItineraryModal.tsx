"use client";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import CustomModal from "@/components/custom/custom-modal";
import CustomForm from "@/components/custom/custom-form";
import CustomInput from "@/components/custom/custom-input";
import CustomSelectField from "@/components/custom/custom-seletectField";
import CustomButton from "@/components/custom/custom-button";
import DayCard from "./DayCard";
import { IoClose } from "react-icons/io5";
import {
  useGetItineraryByIdQuery,
  useUpdateItineraryMutation,
} from "@/redux/features/itinerary/itineraryApi";

interface EditItineraryModalProps {
  visible: boolean;
  onClose: () => void;
  itineraryId: string; // Prop to receive the itinerary ID
}

const EditItineraryModal = ({
  visible,
  onClose,
  itineraryId,
}: EditItineraryModalProps) => {
  const {
    data: itinerary,
    isLoading: isFetching,
    isError,
  } = useGetItineraryByIdQuery(itineraryId, {
    skip: !visible || !itineraryId, // Skip query if modal is not visible or no ID is provided
  });

  const [editItinerary, { isLoading: isUpdating }] =
    useUpdateItineraryMutation();

  const methods = useForm<FieldValues>({
    defaultValues: {
      tripName: "",
      travelMode: "",
      departure: "",
      arrival: "",
      days: [],
    },
  });

  const { control, reset } = methods;

  // Set default form values when itinerary data is fetched
  useEffect(() => {
    if (itinerary) {
      reset({
        tripName: itinerary.tripName || "",
        travelMode: itinerary.travelMode || "",
        departure: itinerary.departure || "",
        arrival: itinerary.arrival || "",
        days: itinerary.days || [],
      });
    }
  }, [itinerary, reset]);

  // Handle form submission to update itinerary
  const handleUpdateItinerary = async (values: FieldValues) => {
    try {
      await editItinerary({ id: itineraryId, data: values }).unwrap();
      onClose(); // Close modal on successful update
    } catch (error) {
      console.error("Failed to update itinerary:", error);
      // Optionally, show an error message to the user
    }
  };

  // Handle loading and error states
  if (isFetching) {
    return <div>Loading itinerary...</div>;
  }

  if (isError) {
    return <div>Error loading itinerary. Please try again.</div>;
  }

  return (
    <CustomModal
      header={
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Itinerary
          </h2>
          <button
            className="text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
            onClick={onClose}
          >
            <IoClose size={18} />
          </button>
        </div>
      }
      isOpen={visible}
      onClose={onClose}
      className="w-full p-2"
    >
      <CustomForm onSubmit={handleUpdateItinerary}>
        <div className="w-full space-y-2">
          <CustomInput
            name="tripName"
            label="Trip Name"
            type="text"
            variant="default"
            size="md"
            fullWidth
            placeholder="Name your adventure (e.g., European Escape)"
            required
          />
          <CustomSelectField
            name="travelMode"
            label="Travel Mode"
            size="md"
            placeholder="How will you travel? (e.g., Plane)"
            items={[
              { value: "plane", label: "Plane" },
              { value: "train", label: "Train" },
              { value: "bus", label: "Bus" },
              { value: "car", label: "Car" },
              { value: "bicycle", label: "Bicycle" },
              { value: "walk", label: "Walk" },
              { value: "boat", label: "Boat" },
              { value: "motorcycle", label: "Motorcycle" },
            ]}
            required
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <CustomInput
              name="departure"
              label="Departure"
              type="text"
              variant="default"
              size="md"
              fullWidth
              placeholder="Where are you starting? (e.g., New York)"
              required
            />
            <CustomInput
              name="arrival"
              label="Arrival"
              type="text"
              variant="default"
              size="md"
              fullWidth
              placeholder="Where are you headed? (e.g., Paris)"
              required
            />
          </div>
          <div className="mb-4">
            <DayCard control={control} />
          </div>
          <CustomButton
            variant="default"
            fullWidth
            loading={isUpdating}
            type="submit"
            className="px-5 py-3"
          >
            Update Itinerary
          </CustomButton>
        </div>
      </CustomForm>
    </CustomModal>
  );
};

export default EditItineraryModal;
