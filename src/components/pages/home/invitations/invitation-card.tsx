import CustomButton from "@/components/custom/custom-button";
import {
  useAcceptEventInviteMutation,
  useDeclineEventInviteMutation,
} from "@/redux/features/event/eventApi";
import { TError } from "@/types/error";
import { IEventInvitation } from "@/types/event.types";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import { PiUserBold } from "react-icons/pi";

interface UpcomingEventCardProps {
  event: IEventInvitation;
}

const InvitationCard = ({ event }: UpcomingEventCardProps) => {
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
    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
      {/* Group Image */}
      <div className="w-full h-[350px] bg-gray-200 rounded-xl mb-4 relative">
        <Image
          src={event?.eventId?.eventImage}
          alt={event?.eventId?.eventName}
          width={350}
          height={350}
          className="w-full h-full object-cover rounded-2xl mb-4"
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
                  {event?.eventId.interestCount}
                </span>
              </div>
            </div>
            <h2 className="text-2xl md:text-[32px] font-semibold text-white">
              {event?.eventId?.eventName}
            </h2>
          </div>
        </div>
      </div>
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

export default InvitationCard;
