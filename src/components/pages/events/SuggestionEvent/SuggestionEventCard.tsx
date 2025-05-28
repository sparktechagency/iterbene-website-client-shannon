import CustomButton from "@/components/custom/custom-button";
import { useInterestEventMutation } from "@/redux/features/event/eventApi";
import { TError } from "@/types/error";
import { IEvent } from "@/types/event.types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { PiUserBold } from "react-icons/pi";

interface UpcomingEventCardProps {
  event: IEvent;
}

const SuggestionEventCard = ({ event }: UpcomingEventCardProps) => {
  const [interestEvent, { isLoading: isInterestLoading }] =
    useInterestEventMutation();

  const handleInterest = async () => {
    try {
      await interestEvent(event?._id).unwrap();
      toast.success("Marked as interested successfully.");
    } catch (error) {
      const err = error as TError;
      toast.error(
        err?.data?.message || "Failed to mark as interested. Please try again."
      );
      console.error("Failed to mark as interested:", error);
    }
  };
  return (
    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
      {/* Group Image */}
      <div className="w-full h-[350px] bg-gray-200 rounded-xl mb-4 relative">
        <Image
          src={event?.eventImage}
          alt={event?.eventName}
          width={350}
          height={350}
          className="w-full h-full object-cover rounded-2xl mb-4"
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
          <CustomButton variant="default" className="py-3" fullWidth>
            View
          </CustomButton>
        </Link>
        <CustomButton
          loading={isInterestLoading}
          onClick={handleInterest}
          variant="outline"
          fullWidth
          className="px-5 py-3"
        >
          Interest
        </CustomButton>
      </div>
    </div>
  );
};

export default SuggestionEventCard;
