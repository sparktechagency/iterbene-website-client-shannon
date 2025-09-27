import ConfirmationPopup from "@/components/custom/custom-popup";
import { useRemoveEventMutation } from "@/redux/features/event/eventApi";
import { TError } from "@/types/error";
import { IEvent } from "@/types/event.types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { PiUserBold } from "react-icons/pi";
import { Eye, Trash2 } from "lucide-react";

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
    <>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Event Image */}
        <div className="relative w-full h-48 sm:h-52 md:h-56 overflow-hidden">
          <Image
            src={event?.eventImage}
            alt={event?.eventName}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0  flex flex-col justify-between bg-black/40 p-4">
            <div className="w-full flex justify-end">
              <div className="bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5">
                <PiUserBold size={14} className="text-secondary" />
                <span className="text-xs font-semibold text-gray-800">
                  {event?.interestCount}
                </span>
              </div>
            </div>
            <div className="w-full">
              <h3 className="text-lg font-bold text-white truncate">
                {event?.eventName}
              </h3>
              <p className="text-white/80 text-sm line-clamp-2 truncate">
                {event?.description || "No description available"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          <Link href={`/events/${event?._id}`} className="w-full block">
            <button className="w-full bg-secondary cursor-pointer text-white font-medium py-2.5 px-4 rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
              <Eye size={16} />
              View Event
            </button>
          </Link>

          <button
            onClick={openRemoveModal}
            className="w-full border border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Remove Event
          </button>
        </div>
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
    </>
  );
};

export default MyEventCard;
