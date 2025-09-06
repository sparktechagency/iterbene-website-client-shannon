import CustomButton from "@/components/custom/custom-button";
import { useNotInterestEventMutation } from "@/redux/features/event/eventApi";
import { TError } from "@/types/error";
import { IEvent } from "@/types/event.types";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { PiUserBold } from "react-icons/pi";
import { Eye, Heart, Users } from "lucide-react";

interface UpcomingEventCardProps {
  event: IEvent;
  handleOptimisticUiUpdate?: (eventId: string) => void;
}

const InterestedEventCard = ({
  event,
  handleOptimisticUiUpdate,
}: UpcomingEventCardProps) => {
  const [notInterest, { isLoading: isNotInterestLoading }] =
    useNotInterestEventMutation();
  const handleNotInterest = async () => {
    try {
      await notInterest(event?._id).unwrap();
      if (handleOptimisticUiUpdate) {
        handleOptimisticUiUpdate(event?._id);
      }
      toast.success("Marked as not interested successfully.");
    } catch (error) {
      const err = error as TError;
      toast.error(
        err?.data?.message ||
          "Failed to mark as not interested. Please try again."
      );
    }
  };
  return (
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Interest Count Badge */}
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <PiUserBold size={14} className="text-secondary" />
          <span className="text-xs font-semibold text-gray-800">
            {event?.interestCount}
          </span>
        </div>

        {/* Interested Badge */}
        <div className="absolute top-3 left-3 bg-secondary text-white rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <Heart size={12} />
          <span className="text-xs font-medium">Interested</span>
        </div>

        {/* Creator Profile */}
        <div className="absolute bottom-14 left-4">
          <Image
            src={event?.creatorId?.profileImage}
            alt={`${event?.creatorId?.firstName} ${event?.creatorId?.lastName}`}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
        </div>

        {/* Event Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white truncate mb-1">
            {event?.eventName}
          </h3>
          <p className="text-white/80 text-sm line-clamp-2">
            {event?.eventDescription || "No description available"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <Link href={`/events/${event?._id}`} className="w-full block">
          <button className="w-full bg-secondary text-white font-medium py-2.5 px-4 rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
            <Eye size={16} />
            View Event
          </button>
        </Link>
        
        <button
          onClick={handleNotInterest}
          disabled={isNotInterestLoading}
          className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Heart size={16} />
          {isNotInterestLoading ? "Removing..." : "Not Interested"}
        </button>
      </div>
    </div>
  );
};

export default InterestedEventCard;
