import { IConnection } from "@/types/connection.types";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
const MyConnectionCard = ({ connection }: { connection: IConnection }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl">
      <Link href={`/${connection?.username}`}>
        <div className="flex items-center space-x-4">
          <Image
            src={connection?.profileImage}
            alt={connection?.fullName}
            width={70}
            height={70}
            className="w-[70px] h-[70px] rounded-full object-cover ring-2 ring-gray-300"
          />
          <div className="flex flex-col">
            <span className="text-gray-800 font-semibold text-lg">
              {connection?.fullName}
            </span>
            <span className="text-gray-600">@{connection?.username}</span>
          </div>
        </div>
      </Link>
      <button className="text-gray-700">
        <Ellipsis size={28} />
      </button>
    </div>
  );
};

export default MyConnectionCard;
