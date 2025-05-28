import { IGroupInvite } from "@/types/group.types";
import { Globe, Lock } from "lucide-react";
import Image from "next/image";
import React from "react";

const MyInvitationsGroupCard = ({ group }: { group: IGroupInvite }) => {
  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-xl">
      <div className="flex items-center space-x-4">
        <Image
          src={group?.groupId?.groupImage}
          alt={group?.groupId?.name}
          width={70}
          height={70}
          className="w-[70px] h-[70px] rounded-full object-cover ring-2 ring-[#9194A9]"
        />
        <div className="flex flex-col gap-3">
          <span className="text-gray-900 font-medium text-lg md:text-xl">
            {group?.groupId?.name}
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {group?.groupId?.privacy === "public" ? (
                <Globe className="text-primary" size={20} />
              ) : (
                <Lock className="text-primary" size={20} />
              )}
              <p className="text-gray-600">
                {group?.groupId?.privacy === "public" ? "Public" : "Private"}{" "}
                group
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-3 rounded-full bg-[#9194A9]"></div>
              <span className="text-gray-900 font-medium">
                {group?.groupId?.participantCount} members
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInvitationsGroupCard;
