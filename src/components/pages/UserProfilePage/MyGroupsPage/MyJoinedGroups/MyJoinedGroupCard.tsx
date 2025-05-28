import { IGroup } from "@/types/group.types";
import { Ellipsis, Globe, Lock } from "lucide-react";
import Image from "next/image";
const MyJoinedGroupCard = ({ group }: { group: IGroup }) => {
  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-xl">
      <div className="flex items-center space-x-4">
        <Image
          src={group?.groupImage}
          alt={group?.name}
          width={70}
          height={70}
          className="w-[70px] h-[70px] rounded-full object-cover ring-2 ring-[#9194A9]"
        />
        <div className="flex flex-col gap-3">
          <span className="text-gray-900 font-medium text-lg md:text-xl">
            {group?.name}
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {group?.privacy === "public" ? (
                <Globe className="text-primary" size={20} />
              ) : (
                <Lock className="text-primary" size={20} />
              )}
              <p className="text-gray-600">
                {group?.privacy === "public" ? "Public" : "Private"} group
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-3 rounded-full bg-[#9194A9]"></div>
              <span className="text-gray-900 font-medium">
                {group?.participantCount} members
              </span>
            </div>
          </div>
        </div>
      </div>
      <button className="text-gray-700">
        <Ellipsis size={28} />
      </button>
    </div>
  );
};

export default MyJoinedGroupCard;
