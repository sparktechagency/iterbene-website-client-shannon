// import { IGroup } from "@/types/group";
// import Image from "next/image";
// import Link from "next/link";
// import React from "react";
// import { PiUserBold } from "react-icons/pi";
// const MyGroupCard = ({ group} : { group: IGroup }) => {
//   return (
//     <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
//       {/* Group Image */}
//       <div className="w-full h-[350px] bg-gray-200 rounded-xl mb-4 relative">
//         <Image
//           src={group?.groupImage}
//           alt={group?.name}
//           width={350}
//           height={350}
//           className="w-full h-full object-cover rounded-2xl mb-4"
//         />
//         <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-950/20 rounded-xl"></div>
//         {/* Member Count Overlay */}
//         <div className="absolute top-5 right-5 bg-white rounded-full px-4 py-2 flex items-center gap-1">
//           <PiUserBold size={24} className="text-secondary" />
//           <span className="text-sm font-semibold text-gray-800">{group?.participantCount}</span>
//         </div>
//         {/* Group Name */}
//         <h2 className="text-2xl md:text-[32px] font-bold text-white absolute bottom-4 left-2">
//           {group?.name}
//         </h2>
//       </div>

//       {/* Buttons */}
//       <div className="flex flex-col gap-3 w-full">
//         <button className="bg-secondary  text-white  px-5 py-3.5 rounded-xl border border-secondary cursor-pointer">
//           <Link href={`/groups/1`}>View</Link>
//         </button>
//         <button className="border border-[#9EA1B3] text-gray-900 px-5 py-3.5   rounded-xl cursor-pointer">
//           Remove
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MyGroupCard;

import { IGroup } from "@/types/group";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { PiUserBold } from "react-icons/pi";
const MyGroupCard = ({ group }: { group: IGroup }) => {
  return (
    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
      {/* Group Image */}
      <div className="w-full h-56 md:h-60 lg:h-[248px]  bg-gray-200 rounded-xl mb-4 relative">
        <Image
          src={group?.groupImage}
          alt={group?.name}
          width={248}
          height={248}
          className="w-full h-56 md:h-60 lg:h-[248px] object-cover rounded-2xl mb-4"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-950/20 rounded-xl"></div>
        {/* Member Count Overlay */}
        <div className="absolute top-5 right-5 bg-white rounded-full px-4 py-2 flex items-center gap-1">
          <PiUserBold size={20} className="text-secondary" />
          <span className="text-sm font-semibold text-gray-800">
            {group?.participantCount}
          </span>
        </div>
        {/* Group Name */}
        <h2 className="text-xl md:text-2xl font-bold text-white absolute bottom-4 left-2">
          {group?.name}
        </h2>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-5 w-full">
        <Link className="w-full block" href={`/groups/${group?._id}`}>
        <button className="w-full bg-secondary  text-white  px-5 py-3 rounded-xl border border-secondary cursor-pointer">
          View
        </button>
        </Link>
        <button className="border border-[#9EA1B3] text-gray-900 px-5 py-3   rounded-xl cursor-pointer">
          Remove
        </button>
      </div>
    </div>
  );
};

export default MyGroupCard;
