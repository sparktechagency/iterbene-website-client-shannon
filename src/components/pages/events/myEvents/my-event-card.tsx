import CustomButton from "@/components/custom/custom-button";
import ConfirmationPopup from "@/components/custom/custom-popup";
import { useRemoveEventMutation } from "@/redux/features/event/eventApi";
import { TError } from "@/types/error";
import { IEvent } from "@/types/event.types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { PiUserBold } from "react-icons/pi";

interface UpcomingEventCardProps {
  event: IEvent;
  handleOptimisticUiUpdate?: (eventId: string) => void;
}

const MyEventCard = ({
  event,
  handleOptimisticUiUpdate,
}: UpcomingEventCardProps) => {
  const [removeEvent, { isLoading: isRemoving }] = useRemoveEventMutation();
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);
  const handleRemoveEvent = async () => {
    try {
      await removeEvent(event?._id).unwrap();
      if (handleOptimisticUiUpdate) {
        handleOptimisticUiUpdate(event?._id);
      }
      toast.success("Event removed successfully.");
    } catch (error) {
      const err = error as TError;
      toast.error(
        err?.data?.message || "Failed to remove event. Please try again."
      );
    }
  };
  const openRemoveModal = () => {
    setIsRemoveModalOpen(true);
  };
  const closeRemoveModal = () => {
    setIsRemoveModalOpen(false);
  };
  return (
    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
      {/* Group Image */}
      <div className="w-full h-56 md:h-60 lg:h-[248px] bg-gray-200 rounded-xl mb-4 relative">
        <Image
          src={event?.eventImage}
          alt={event?.eventName}
          width={248}
          height={248}
          className="w-full h-56 md:h-60 lg:h-[248px] object-cover rounded-2xl mb-4"
        />
        <div className="absolute px-4 py-5 rounded-xl top-0 left-0 right-0 bottom-0 bg-gray-950/20">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex  justify-between items-center">
              <Image
                src={event?.creatorId?.profileImage}
                alt={event?.creatorId?.fullName}
                width={60}
                height={60}
                className="size-[60px] rounded-full object-cover mr-3 "
              />
              <div className="bg-white rounded-full px-4 py-2 flex items-center gap-1">
                <PiUserBold size={24} className="text-secondary" />
                <span className="text-sm font-semibold text-gray-800">
                  {event?.interestCount}
                </span>
              </div>
            </div>
            <h2 className="text-2xl md:text-[32px] font-semibold text-white">
              {event?.eventName}
            </h2>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full">
        <Link href={`/events/${event?._id}`}>
          <CustomButton variant="default" fullWidth className="px-5 py-3">
            View
          </CustomButton>
        </Link>

        <CustomButton
          onClick={openRemoveModal}
          variant="outline"
          fullWidth
          className="px-5 py-3"
        >
          Remove
        </CustomButton>
      </div>
      <ConfirmationPopup
        isOpen={isRemoveModalOpen}
        onClose={closeRemoveModal}
        onConfirm={handleRemoveEvent}
        type="delete"
        title="Remove Event"
        message="Are you sure you want to remove this event? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        isLoading={isRemoving}
      />
    </div>
  );
};

export default MyEventCard;
