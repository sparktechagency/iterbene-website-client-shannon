"use client";
import DayCard from "./DayCard";
import CustomModal from "@/components/custom/custom-modal";
import { IoClose } from "react-icons/io5";
import CustomForm from "@/components/custom/custom-form";
import CustomInput from "@/components/custom/custom-input";
import CustomSelectField from "@/components/custom/custom-seletectField";
import CustomButton from "@/components/custom/custom-button";
import { FieldValues, useForm } from "react-hook-form";

interface ItineraryModalProps {
  visible: boolean;
  onClose: () => void;
  handleCreateItinerary: (values: FieldValues) => void;
}

const ItineraryModal = ({ visible, onClose, handleCreateItinerary }: ItineraryModalProps) => {
  const methods = useForm();
 const { control } = methods;
  return (
    <CustomModal
      header={
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800">Create Itinerary</h2>
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
    >
      <CustomForm onSubmit={handleCreateItinerary}>
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
            items={["Car", "Plane", "Train", "Bus", "Bicycle", "Walk", "Boat", "Motorcycle"]}
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
            <DayCard control={control}/>
          </div>
          <CustomButton
            variant="default"
            fullWidth
            type="submit"
            className="px-5 py-3"
          >
            Create Itinerary
          </CustomButton>
        </div>
      </CustomForm>
    </CustomModal>
  );
};

export default ItineraryModal;