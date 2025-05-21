import CustomButton from "@/components/custom/custom-button";
import { IConnectionRequest } from "@/types/connection.types";
import Image from "next/image";
import Link from "next/link";

const FriendRequestCard = ({ request }: { request: IConnectionRequest }) => {
  return (
    <div className="w-full bg-white p-6  rounded-2xl">
      <div className="flex items-center">
        <Image
          src={request?.sentBy?.profileImage}
          alt="Profile"
          width={60}
          height={60}
          className="size-[60px] rounded-full object-cover mr-4 ring ring-primary flex-shrink-0"
        />
        <h1>
          <Link href={`/${request?.sentBy?.username}`}>
            <span className="text-[18px] font-bold">
              {request?.sentBy?.fullName}
            </span>{" "}
          </Link>
          <span className="text-[18px] text-gray-500">
            wants to add you to friends
          </span>
        </h1>
      </div>
      <div className="mt-5 flex justify-between gap-4 items-center">
        <CustomButton variant="default" className="px-5 py-3" fullWidth>
          Accept
        </CustomButton>
        <CustomButton variant="outline" className="px-5 py-3" fullWidth>
          Decline
        </CustomButton>
      </div>
    </div>
  );
};

export default FriendRequestCard;
