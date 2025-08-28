import { IGroupDetails } from "@/types/group.types";
import { LucideUserRound } from "lucide-react";
import { BsPeople } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";

const GroupSummary = ({
  groupDetailsData,
}: {
  groupDetailsData: IGroupDetails;
}) => {
  return (
    <div className="w-full col-span-full md:col-span-7 bg-white p-8 rounded-xl">
      <div className="w-full space-y-5 ">
        <div className="flex items-center gap-4">
          <BsPeople className="text-gray-900" size={24} />
          <h1 className="text-base font-medium">
            {groupDetailsData?.participantCount} people
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <LucideUserRound className="text-gray-900" size={24} />
          <h1 className="text-base font-medium mt-1">
            Created by {" "}
            <span className="font-semibold text-lg ">
              {groupDetailsData?.creatorId?.fullName}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <HiOutlineLocationMarker className="text-gray-900" size={24} />
          <h1 className="text-base font-medium">
            {groupDetailsData?.locationName}
          </h1>
        </div>
      </div>
      <h1 className="text-lg mt-7 overflow-hidden  text-ellipsis">
        {groupDetailsData?.description}
      </h1>
    </div>
  );
};

export default GroupSummary;
