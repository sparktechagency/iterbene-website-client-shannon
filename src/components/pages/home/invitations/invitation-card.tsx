
import {
  useAcceptEventInviteMutation,
  useDeclineEventInviteMutation,
} from "@/redux/features/event/eventApi";
import { TError } from "@/types/error";
import { IEventInvitation } from "@/types/event.types";
import { Check, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { PiUserBold } from "react-icons/pi";

interface UpcomingEventCardProps {
  event: IEventInvitation;
  handleAcceptInvitation: (invitationId: string) => void;
}

const InvitationCard = ({
  event,
  handleAcceptInvitation,
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
      if (handleAcceptInvitation) {
        handleAcceptInvitation(event?._id);
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
        <div className="absolute inset-0  flex flex-col justify-between bg-black/40 p-4">
          <div className="w-full flex justify-end">
            <div className="bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <PiUserBold size={14} className="text-secondary" />
              <span className="text-xs font-semibold text-gray-800">
                {event?.eventId?.interestCount}
              </span>
            </div>
          </div>
          <div className="w-full">
            <div className="flex items-center gap-3 mb-1">
              <Image
                src={event?.eventId?.creatorId?.profileImage}
                alt={`${event?.eventId?.creatorId?.firstName} ${event?.eventId?.creatorId?.lastName}`}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border-2 border-white mb-1"
              />
              <h3 className="text-lg font-bold text-white truncate">
                {event?.eventId?.eventName}
              </h3>
            </div>
            <p className="text-white/80 text-sm line-clamp-2 truncate">
              {event?.eventId?.description || "No description available"}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <button
          onClick={handleAccept}
          disabled={isAccepting}
          className="w-full bg-secondary cursor-pointer text-white font-medium py-2.5 px-4 rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Check size={16} />
          {isAccepting ? "Accepting..." : "Accept"}
        </button>

        <button
          onClick={handleDecline}
          disabled={isDeclining}
          className="w-full border cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <X size={16} />
          {isDeclining ? "Declining..." : "Decline"}
        </button>
      </div>
    </div>
  );
};

export default InvitationCard;
