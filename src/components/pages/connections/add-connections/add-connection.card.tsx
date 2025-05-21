import { IConnection } from "@/types/connection.types";
import Image from "next/image";
const AddConnectionCard = ({ connection }: { connection: IConnection }) => {
  return (
    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
      {/* Profile Image */}
      <Image
        src={connection?.profileImage}
        alt={connection?.username}
        width={248}
        height={248}
        className="w-full h-56 md:h-60 lg:h-[248px] object-cover rounded-2xl mb-4"
      />
      {/* Name */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {connection?.fullName}
      </h2>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full">
        <button className="bg-[#FEEFE8] text-secondary px-5 py-3 rounded-xl border border-secondary transition cursor-pointer">
          Add Connection
        </button>
        <button className="border border-[#9EA1B3] text-gray-900 px-5 py-3   rounded-xl hover:bg-gray-100 transition cursor-pointer">
          Remove
        </button>
      </div>
    </div>
  );
};

export default AddConnectionCard;
