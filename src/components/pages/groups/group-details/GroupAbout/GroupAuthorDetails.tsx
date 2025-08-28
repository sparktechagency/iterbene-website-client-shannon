import {IGroupDetails } from "@/types/group.types";
import { getFullName } from "@/utils/nameUtils";
import moment from "moment";
import Image from "next/image";
const GroupAuthorDetails = ({
  groupDetailsData,
}: {
  groupDetailsData: IGroupDetails;
}) => {
  return (
    <div className="w-full col-span-full md:col-span-7 bg-white p-6 md:p-9 rounded-xl">
      <h1 className="text-2xl font-semibold">Meet Your Leader</h1>
      <div className="py-5">
        {groupDetailsData?.creatorId?.profileImage && (
          <Image
            src={groupDetailsData?.creatorId?.profileImage}
            alt="leader"
            width={174}
            height={174}
            className="size-[174px] object-cover rounded-full mx-auto"
          />
        )}
        <div className="mt-5">
          <h1 className="text-xl md:text-2xl xl:text-3xl font-semibold text-center text-gray-950">
            {getFullName(groupDetailsData?.creatorId)}
          </h1>
          <div className="flex flex-wrap gap-2 text-gray-600 text-base items-center justify-center">
            <p className="text-gray-600 text-center">
              @{groupDetailsData?.creatorId?.username}
            </p>
            <div className="size-1.5 bg-[#9194A9] rounded-full"></div>
            <p className="text-gray-600 text-center">
              Joined{" "}
              {moment(groupDetailsData?.creatorId?.createdAt).format(
                "MMM DD, YYYY"
              )}
            </p>
          </div>
        </div>
      </div>
      <h1 className="text-lg">{groupDetailsData?.creatorId?.description}</h1>
    </div>
  );
};

export default GroupAuthorDetails;
