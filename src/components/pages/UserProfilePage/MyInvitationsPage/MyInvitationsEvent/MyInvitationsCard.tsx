import Image from "next/image";
import { getFullName } from "@/utils/nameUtils";
import React from "react";
import { PiUserBold } from "react-icons/pi";
interface IAuthor {
  fullName: string;
  profileImage: {
    imageUrl: string;
  };
}

interface IEvent {
  id: number;
  title: string;
  author: IAuthor;
  image: {
    imageUrl: string;
  };
  members: string;
}

interface MyInvitationsCardProps {
  invitation: IEvent;
  type: string;
}

const MyInvitationsCard: React.FC<MyInvitationsCardProps> = ({
  invitation,
  type,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl  p-6 flex flex-col items-center space-y-4">
      {/* Group Image */}
      <div className="w-full h-[350px] bg-gray-200 rounded-xl mb-4 relative">
        <Image
          src={invitation.image.imageUrl}
          alt={invitation.title}
          width={350}
          height={350}
          className="w-full h-full object-cover  rounded-2xl mb-4"
        />
        <div className="absolute px-4 py-4 rounded-xl top-0 left-0 right-0 bottom-0 bg-gray-950/40">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex  justify-between items-center">
              <Image
                src={invitation?.author?.profileImage?.imageUrl || ""}
                alt={getFullName(invitation.author) || "Author"}
                width={60}
                height={60}
                className="size-[60px] rounded-full ring-2 ring-primary object-cover mr-3 "
              />
              <div className="bg-white rounded-full px-4 py-3 flex items-center gap-1">
                <PiUserBold size={24} className="text-secondary" />
                <span className="text-sm font-semibold text-gray-800">
                  {invitation.members}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                {invitation.title}
              </h2>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-gray-200 font-medium">
                <span>May 15 - May 20, 2023</span>
                <div className="flex items-center gap-1">
                  <div className="size-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span>2 days & 1 night</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span>around $500-$1000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {type === "invitation" ? (
        <div className="flex gap-6 w-full">
          <button className="w-full bg-secondary font-medium text-white  px-5 py-3.5 rounded-xl border border-secondary transition cursor-pointer">
            Accept
          </button>
          <button className="w-full border border-[#9EA1B3] font-medium text-gray-900 px-5 py-3.5   rounded-xl hover:bg-gray-100 transition cursor-pointer">
            Decline
          </button>
        </div>
      ) : (
        <div className="flex gap-6 w-full">
          <button className="w-full bg-secondary font-medium  text-white  px-5 py-3.5 rounded-xl border border-secondary transition cursor-pointer">
            View
          </button>
          <button className="w-full border font-medium border-[#9EA1B3] text-gray-900 px-5 py-3.5   rounded-xl hover:bg-gray-100 transition cursor-pointer">
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default MyInvitationsCard;
