import { BiMessageSquareDetail } from "react-icons/bi";
import Image from "next/image";
import React from "react";
import { IChat } from "@/types/chatTypes";
import useUser from "@/hooks/useUser";
import { IUser } from "@/types/user.types";
import Link from "next/link";
interface ContactListCardProps {
  contact: IChat;
}
const ContactListCard: React.FC<ContactListCardProps> = ({ contact }) => {
  const user = useUser();
  // Get the receiver user details
  const receiverDetails: IUser | undefined = (
    contact?.participants as IUser[]
  )?.find((u: IUser) => u._id !== user?._id);
  return (
    <Link href={`/messages/${receiverDetails?._id}`}>
      <div className="w-full flex items-center justify-between p-4  rounded-2xl bg-white">
      <div className="flex items-center">
        {receiverDetails?.profileImage && (
          <Image
            src={receiverDetails?.profileImage}
            alt="Profile"
            width={60}
            height={60}
            className="size-[60px] ring ring-primary rounded-full object-cover mr-4"
          />
        )}
        <div>
          <h2 className="font-semibold">{receiverDetails?.fullName}</h2>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {(contact?.unviewedCount ?? 0) > 0 ? (
          <span className="bg-primary text-white rounded-full size-8 flex items-center font-semibold justify-center text-sm">
            {contact?.unviewedCount ?? 0}
          </span>
        ) : (
          <BiMessageSquareDetail size={25} className="cursor-pointer" />
        )}
      </div>
    </div>
    </Link>
  );
};

export default ContactListCard;
