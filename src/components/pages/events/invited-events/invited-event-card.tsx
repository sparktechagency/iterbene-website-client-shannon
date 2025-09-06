import {
  useAcceptEventInviteMutation,
  useDeclineEventInviteMutation,
} from "@/redux/features/event/eventApi";
import { TError } from "@/types/error";
import { IEventInvitation } from "@/types/event.types";
import Image from "next/image";
import toast from "react-hot-toast";
import { PiUserBold } from "react-icons/pi";
import {  Check, X } from "lucide-react";

interface UpcomingEventCardProps {
  event: IEventInvitation;
  handleOptimisticUiUpdate?: (inviteId: string) => void;
}

const InvitedEventCard = ({
  event,
  handleOptimisticUiUpdate,
}: UpcomingEventCardProps) => {
  const [acceptInvitation, { isLoading: isAccepting }] =
    useAcceptEventInviteMutation();
  const [declineInvitation, { isLoading: isDeclining }] =
    useDeclineEventInviteMutation();
  const handleAccept = async () => {
    try {
      const payload = {
        inviteId: event._id,
      };
      await acceptInvitation(payload).unwrap();
      if (handleOptimisticUiUpdate) {
        handleOptimisticUiUpdate(event._id);
      }
      toast.success("Invitation accepted successfully");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Failed to accept invitation");
      console.error("Failed to accept invitation:", error);
    }
  };
  const handleDecline = async () => {
    try {
      const payload = {
        inviteId: event._id,
      };
      await declineInvitation(payload).unwrap();
      if (handleOptimisticUiUpdate) {
        handleOptimisticUiUpdate(event._id);
      }
      toast.success("Invitation declined successfully");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Failed to decline invitation");
      console.error("Failed to decline invitation:", error);
    }
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Event Image */}
      <div className="relative w-full h-48 sm:h-52 md:h-56 overflow-hidden">
        <Image
          src={event?.eventId?.eventImage}
          alt={event?.eventId?.eventName}
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Interest Count Badge */}
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <PiUserBold size={14} className="text-secondary" />
          <span className="text-xs font-semibold text-gray-800">
            {event?.eventId?.interestCount}
          </span>
        </div>
        {/* Creator Profile */}
        <div className="absolute bottom-14 left-4">
          <Image
            src={event?.eventId?.creatorId?.profileImage}
            alt={`${event?.eventId?.creatorId?.firstName} ${event?.eventId?.creatorId?.lastName}`}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
        </div>

        {/* Event Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white truncate mb-1">
            {event?.eventId?.eventName}
          </h3>
          <p className="text-white/80 text-sm line-clamp-2">
            {event?.eventId?.eventDescription || "No description available"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <button
          onClick={handleAccept}
          disabled={isAccepting}
          className="w-full bg-secondary text-white font-medium py-2.5 px-4 rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Check size={16} />
          {isAccepting ? "Accepting..." : "Accept"}
        </button>
        
        <button
          onClick={handleDecline}
          disabled={isDeclining}
          className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <X size={16} />
          {isDeclining ? "Declining..." : "Decline"}
        </button>
      </div>
    </div>
  );
};

export default InvitedEventCard;
