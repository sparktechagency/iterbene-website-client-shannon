import { Ellipsis } from "lucide-react";
import Image from "next/image";
import React from "react";
import { IGroup } from "./MyGroups";
import { HiGlobe } from "react-icons/hi";
const MyGroupCard = ({ group }: { group: IGroup }) => {
  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-lg">
      <div className="flex items-center space-x-4">
        <Image
          src={group.image}
          alt={group.name}
          width={70}
          height={70}
          className="w-[70px] h-[70px] rounded-full object-cover ring-2 ring-[#9194A9]"
        />
        <div className="flex flex-col gap-3">
          <span className="text-gray-900 font-medium text-lg md:text-xl">
            {group.name}
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <HiGlobe size={24} className="text-[#9194A9]" />
              <span className="text-gray-900 font-medium">Public Group</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-3 rounded-full bg-[#9194A9]"></div>
              <span className="text-gray-900 font-medium">
                {group.members} members
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

export default MyGroupCard;
