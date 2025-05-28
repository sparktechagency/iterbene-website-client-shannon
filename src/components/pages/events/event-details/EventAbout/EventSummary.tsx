import { IEventDetails } from "@/types/event.types";
import { CalendarClock, LucideUserRound, Timer } from "lucide-react";
import moment from "moment";
import { BsPeople } from "react-icons/bs";
import {
  HiOutlineLocationMarker,
} from "react-icons/hi";

const EventSummary = ({
  eventDetailsData,
}: {
  eventDetailsData: IEventDetails;
}) => {
  return (
    <div className="w-full col-span-full md:col-span-7 bg-white p-8 rounded-xl">
      <div className="w-full space-y-5 pt-14">
        <div className="flex items-center gap-4">
          <BsPeople className="text-gray-900" size={24} />
          <h1 className="text-base font-medium">
            {eventDetailsData?.interestCount} people
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <LucideUserRound className="text-gray-900" size={24} />
          <h1 className="text-base font-medium mt-1">
            Created by
            <span className="font-semibold text-lg ">
              {eventDetailsData?.creatorId?.fullName}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <HiOutlineLocationMarker className="text-gray-900" size={24} />
          <h1 className="text-base font-medium">
            {eventDetailsData?.locationName}
          </h1>
        </div>
        {/* Date Range with Calendar Icon */}
        <div className="flex items-center gap-3">
          <CalendarClock size={24} />
          <h1 className="text-base font-medium text-gray-800">
            {moment(eventDetailsData?.startDate).format("MMM D, YYYY, h:mm A")}{" "}
            - {moment(eventDetailsData?.endDate).format("MMM D, YYYY, h:mm A")}
          </h1>
        </div>
        {/* Duration with Clock Icon */}
        <div className="flex items-center gap-3">
         <Timer size={24} />
          <h1 className="text-base font-medium text-gray-800">
            {eventDetailsData?.duration?.days}{" "}
            {eventDetailsData?.duration?.days === 1 ? "day" : "days"},{" "}
            {eventDetailsData?.duration?.nights}{" "}
            {eventDetailsData?.duration?.nights === 1 ? "night" : "nights"}
          </h1>
        </div>
        {/* Price with Currency Icon */}
        <div className="flex items-center gap-3">
          <h1>💵</h1>
          <h1 className="text-base font-medium text-gray-800">
            $
            {eventDetailsData?.eventCost?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h1>
        </div>
      </div>
      <h1 className="text-lg mt-7">
        {eventDetailsData?.description || "No description available."}
      </h1>
    </div>
  );
};

export default EventSummary;
