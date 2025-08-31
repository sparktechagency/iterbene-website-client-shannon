import { IGroupDetails } from "@/types/group.types";
import { getFullName } from "@/utils/nameUtils";
import { LucideUserRound } from "lucide-react";
import { BsPeople } from "react-icons/bs";

const GroupSummary = ({
  groupDetailsData,
}: {
  groupDetailsData: IGroupDetails;
}) => {
  return (
    <div className="w-full col-span-full md:col-span-7 bg-white p-6 md:p-8 rounded-xl">
      <h2 className="text-xl font-semibold text-gray-900 pb-4">About</h2>
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
            Created by{" "}
            <span className="font-semibold text-lg ">
              {getFullName(groupDetailsData?.creatorId)}
            </span>
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
