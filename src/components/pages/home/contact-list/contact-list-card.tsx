import { BiMessageSquareDetail } from "react-icons/bi";

import Image from "next/image";
import React from "react";
interface ContactListCardProps {
  contact: {
    id: number;
    name: string;
    profileImage: string;
    messagesCount: number;
  };
}
const ContactListCard: React.FC<ContactListCardProps> = ({ contact }) => {
  return (
    <div className="w-full flex items-center justify-between p-4  rounded-2xl bg-white">
      <div className="flex items-center">
        <Image
          src={contact.profileImage}
          alt="Profile"
          width={60}
          height={60}
          className="size-[60px] ring ring-[#40E0D0] rounded-full object-cover mr-4"
        />
        <div>
          <h2 className="font-semibold">{contact.name}</h2>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {contact.messagesCount > 0 ? (
          <span className="bg-[#40E0D0] text-white rounded-full size-8 flex items-center font-semibold justify-center text-sm">
            {contact.messagesCount}
          </span>
        ) : (
          <BiMessageSquareDetail
            size={25}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default ContactListCard;
