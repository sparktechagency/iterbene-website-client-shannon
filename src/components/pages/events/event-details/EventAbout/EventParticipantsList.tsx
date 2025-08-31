import { IEventDetails } from "@/types/event.types";
import Image from "next/image";
import React from "react";

const EventParticipantsList = ({
  eventDetailsData,
}: {
  eventDetailsData: IEventDetails;
}) => {
  return (
    <div className="w-full col-span-full md:col-span-5 bg-white p-6 md:p-8 rounded-xl">
      {/* Heading and "Show more" link */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          Participants
        </h2> 
      </div>

      {/* Participants list */}
      <div className="w-full max-h-[300px] scrollbar-hide overflow-y-auto space-y-4">
        {eventDetailsData?.interestedUsers?.length > 0 ? (
          eventDetailsData?.interestedUsers?.map((participant) => (
            <div key={participant._id} className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={participant?.profileImage || "/default-profile.png"}
                  alt={`${participant?.firstName} ${participant?.lastName} 's profile`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="text-gray-900 font-medium">
                  {`${participant?.firstName} ${participant?.lastName}`}
                </p>
                <p className="text-gray-500 text-sm">
                  @{participant?.username}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No participants found.</p>
        )}
      </div>
    </div>
  );
};

export default EventParticipantsList;
