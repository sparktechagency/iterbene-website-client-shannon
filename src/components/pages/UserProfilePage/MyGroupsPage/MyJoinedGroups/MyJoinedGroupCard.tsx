import { IGroup } from "@/types/group.types";
import { Globe, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const MyJoinedGroupCard = ({ group }: { group: IGroup }) => {
  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-xl relative">
      <div className="flex items-center space-x-4">
        <Image
          src={group?.groupImage}
          alt={group?.name}
          width={60}
          height={60}
          className="size-[60px] rounded-full object-cover ring-2 ring-[#9194A9]"
        />
        <div className="flex flex-col gap-1">
          <Link href={`/groups/${group?._id}`}>
            <span className="text-gray-900 font-medium text-lg ">
              {group?.name}
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm -ml-1">
            <div className="flex items-center gap-1">
              {group?.privacy === "public" ? (
                <Globe className="text-primary" size={18} />
              ) : (
                <Lock className="text-primary" size={18} />
              )}
              <p className="text-gray-600">
                {group?.privacy === "public" ? "Public" : "Private"} group
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-primary"></div>
              <span className="text-gray-900">
                {group?.participantCount} members
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MyJoinedGroupCard;
