"use client";
import { IEvent } from "@/types/event.types";
import Image from "next/image";
import { PiUserBold } from "react-icons/pi";

const UpcomingEventCard = ({ event }: { event: IEvent }) => {
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
            <div className="flex items-center gap-3 mb-1">
              <Image
                src={event?.creatorId?.profileImage}
                alt={`${event?.creatorId?.firstName} ${event?.creatorId?.lastName}`}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border-2 border-white mb-1"
              />
              <h3 className="text-lg font-bold text-white truncate">
                {event?.eventName}
              </h3>
            </div>
            <p className="text-white/80 text-sm line-clamp-2 truncate">
              {event?.description || "No description available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventCard;
