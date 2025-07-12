"use client";
import { IEvent } from "@/types/event.types";
import Image from "next/image";

const UpcomingEventCard = ({ event }: { event: IEvent }) => {
  return (
    <div className="w-full relative  rounded-xl cursor-pointer">
      <div className="relative w-full h-[382px] rounded-xl">
        {event?.eventImage && (
          <Image
            src={event?.eventImage}
            alt={event?.eventName}
            width={500}
            height={500}
            className="w-full h-full object-cover rounded-xl"
          />
        )}
      </div>
      <div className="absolute p-4 rounded-xl top-0 left-0 right-0 bottom-0 bg-gray-950/30 ">
        <div className="w-full h-full flex flex-col justify-between">
          {event?.creatorId?.profileImage && (
            <Image
              src={event?.creatorId?.profileImage}
              alt={event.creatorId.fullName}
              width={60}
              height={60}
              className="size-[60px] rounded-full object-cover mr-3 ring-2 ring-primary"
            />
          )}

          <h2 className="text-xl md:text-2xl font-semibold text-white">
            {event.eventName}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventCard;
