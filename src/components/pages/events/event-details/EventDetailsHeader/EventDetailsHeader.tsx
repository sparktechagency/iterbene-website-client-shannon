import { Globe, Lock } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import useUser from "@/hooks/useUser";
import toast from "react-hot-toast";
import { TError } from "@/types/error";
import { useRouter } from "next/navigation";
import { IEventDetails } from "@/types/event.types";
import EventInviteModal from "./EventInviteModal";
import {
  useInterestEventMutation,
  useNotInterestEventMutation,
  useRemoveEventMutation,
} from "@/redux/features/event/eventApi";

const EventDetailsHeader = ({
  eventDetailsData,
}: {
  eventDetailsData: IEventDetails;
}) => {
  const user = useUser();
  const owner = eventDetailsData?.creatorId?._id === user?._id;
  const isInterested = eventDetailsData?.interestedUsers?.find(
    (interestedUser) => interestedUser?._id === user?._id
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const [interested, { isLoading: isInterestedLoading }] =
    useInterestEventMutation();
  const [noInterest, { isLoading: isNoInterestLoading }] =
    useNotInterestEventMutation();
  const [removeEvent, { isLoading: isRemoving }] = useRemoveEventMutation();
  const handleRemoveEvent = async () => {
    try {
      await removeEvent(eventDetailsData?._id).unwrap();
      toast.success("Event removed successfully");
      router.push("/events");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Failed to remove event");
    }
  };
  const handleInterested = async () => {
    try {
      await interested(eventDetailsData?._id).unwrap();
      toast.success("You are now interested in this event");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Failed to express interest");
    }
  };
  const handleNotInterest = async () => {
    try {
      await noInterest(eventDetailsData?._id).unwrap();
      toast.success("You are no longer interested in this event");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Failed to express interest");
    }
  };

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  console.log("isInterested Users:", isInterested);
  return (
    <>
      <div className="w-full bg-white rounded-xl relative">
        {eventDetailsData?.eventImage && (
          <Image
            src={eventDetailsData?.eventImage}
            alt="background"
            width={1600}
            height={360}
            className="w-full h-[200px] sm:h-[280px] md:h-[360px] object-cover rounded-t-2xl"
          />
        )}

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 px-[24px] pt-[16px] pb-[20px]  ">
          <div className="space-y-2">
            <h1 className="text-center md:text-left text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold text-gray-800">
              {eventDetailsData?.eventName}{" "}
            </h1>
            <div className="flex flex-wrap gap-2 sm:gap-3 text-gray-600 text-sm sm:text-lg items-center">
              {eventDetailsData?.privacy === "public" ? (
                <Globe className="text-primary" size={20} />
              ) : (
                <Lock className="text-primary" size={20} />
              )}
              <p className="text-gray-600">
                {eventDetailsData?.privacy === "public" ? "Public" : "Private"}{" "}
                Event
              </p>
              <div className="size-2 bg-primary rounded-full"></div>
              <p className="text-gray-600">
                {eventDetailsData?.interestCount} interested people
              </p>
            </div>
          </div>
          <div className="flex gap-5">
            {isInterested ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={openInviteModal}
                  className="text-primary cursor-pointer bg-[#E9F8F9] border border-primary font-medium px-10 py-2 rounded-xl hover:bg-primary hover:text-white transition-colors"
                >
                  Invite
                </button>
                {owner ? (
                  <button
                    disabled={isRemoving}
                    onClick={handleRemoveEvent}
                    className="text-gray-600 cursor-pointer bg-transparent border border-gray-600 font-medium px-5 py-2 rounded-xl  transition-colors"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    disabled={isNoInterestLoading}
                    onClick={handleNotInterest}
                    className="text-gray-600 text-base cursor-pointer bg-transparent border border-gray-600 font-medium px-5 py-2 rounded-xl  transition-colors"
                  >
                    Not Interested
                  </button>
                )}
              </div>
            ) : (
              <div>
                <button
                  onClick={handleInterested}
                  disabled={isInterestedLoading}
                  className="text-primary cursor-pointer bg-[#E9F8F9] border border-primary font-medium px-10 py-2 rounded-xl hover:bg-primary hover:text-white transition-colors"
                >
                  Interested
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <EventInviteModal
        eventDetailsData={eventDetailsData}
        isInviteModalOpen={isInviteModalOpen}
        setIsInviteModalOpen={setIsInviteModalOpen}
        closeInviteModal={closeInviteModal}
      />
    </>
  );
};

export default EventDetailsHeader;
