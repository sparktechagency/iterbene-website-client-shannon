import { IConnectionRequest } from "@/types/connection.types";
import Image from "next/image";
import Link from "next/link";
const RequestedConnectionCard = ({
  request,
}: {
  request: IConnectionRequest;
}) => {
  return (
    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
      {/* Profile Image */}
      <Link className="w-full" href={`/${request?.sentBy?.username}`}>
        <Image
          src={request?.sentBy?.profileImage}
          alt={request?.sentBy?.username}
          width={248}
          height={248}
          className="w-full h-56 md:h-60 lg:h-[248px] object-cover rounded-2xl mb-4"
        />
      </Link>
      {/* Name */}
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        {request?.sentBy?.fullName}
      </h2>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full">
        <button className="bg-secondary text-white px-5 py-3  rounded-xl cursor-pointer">
          Accept
        </button>
        <button className="border border-[#9EA1B3] text-gray-900 px-5 py-3  rounded-xl  hover:bg-gray-100 transition cursor-pointer">
          Decline
        </button>
      </div>
    </div>
  );
};

export default RequestedConnectionCard;
