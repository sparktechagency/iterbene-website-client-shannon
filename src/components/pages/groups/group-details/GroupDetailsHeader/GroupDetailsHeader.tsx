import { IGroup } from "@/types/group.types";
import { Globe } from "lucide-react";
import Image from "next/image";

const GroupDetailsHeader = ({
  groupDetailsData,
}: {
  groupDetailsData: IGroup;
}) => {
  return (
    <div className="w-full bg-white rounded-xl relative">
      {/* Background Image */}
      {groupDetailsData?.groupImage && (
        <Image
          src={groupDetailsData?.groupImage}
          alt="background"
          width={1600}
          height={360}
          className="w-full h-[200px] sm:h-[280px] md:h-[360px] object-cover rounded-t-2xl"
        />
      )}

      {/* Profile Section */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8  px-[24px] md:px-[40px] py-[24px] md:py-[36px] ">
        <div className="space-y-2">
          <h1 className="text-center md:text-left text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold text-gray-800">
            {groupDetailsData?.name}
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-3 text-gray-600 text-sm sm:text-lg items-center">
            <Globe className="text-primary" size={20} />
            <p className="text-gray-600">
              {groupDetailsData?.privacy === "public" ? "Public" : "Private"}{" "}
              group
            </p>
            <div className="size-2 bg-primary rounded-full"></div>
            <p className="text-gray-600">
              {groupDetailsData?.participantCount} members
            </p>
          </div>
        </div>
        <div className="flex gap-5">
          <button className="text-primary bg-[#E9F8F9] border border-primary font-medium px-10 py-3 rounded-xl">
            Invite
          </button>
          <button className="text-black bg-transparent border border-[#9194A9] font-medium px-8 py-3 rounded-xl">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsHeader;
