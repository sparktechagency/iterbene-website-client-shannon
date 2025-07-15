import CustomButton from "@/components/custom/custom-button";
import {
  useAcceptEventInviteMutation,
  useDeclineEventInviteMutation,
} from "@/redux/features/event/eventApi";
import { TError } from "@/types/error";
import { IEventInvitation } from "@/types/event.types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { PiUserBold } from "react-icons/pi";

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
    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
      {/* Group Image */}
      <Link href={`/events/${event._id}`}>
        <div className="w-full h-56 md:h-60 lg:h-[248px] bg-gray-200 rounded-xl mb-4 relative">
          <Image
            src={event?.eventId?.eventImage}
            alt={event?.eventId?.eventName}
            width={248}
            height={248}
            className="w-full h-56 md:h-60 lg:h-[248px] object-cover rounded-2xl mb-4"
          />
          <div className="absolute px-4 py-5 rounded-xl top-0 left-0 right-0 bottom-0 bg-gray-950/20">
            <div className="w-full h-full flex flex-col justify-between">
              <div className="flex  justify-between items-center">
                <Image
                  src={event?.eventId?.creatorId?.profileImage}
                  alt={event?.eventId?.creatorId?.fullName}
                  width={60}
                  height={60}
                  className="size-[60px] rounded-full object-cover mr-3 "
                />
                <div className="bg-white rounded-full px-4 py-2 flex items-center gap-1">
                  <PiUserBold size={24} className="text-secondary" />
                  <span className="text-sm font-semibold text-gray-800">
                    {event?.eventId?.interestCount}
                  </span>
                </div>
              </div>
              <h2 className="text-2xl md:text-[32px] font-semibold text-white">
                {event?.eventId?.eventName}
              </h2>
            </div>
          </div>
        </div>
      </Link>
      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full">
        <CustomButton
          loading={isAccepting}
          onClick={handleAccept}
          variant="default"
          className="py-3"
        >
          Accept
        </CustomButton>
        <CustomButton
          loading={isDeclining}
          onClick={handleDecline}
          variant="outline"
          className="py-3"
        >
          Decline
        </CustomButton>
      </div>
    </div>
  );
};

export default InvitedEventCard;
