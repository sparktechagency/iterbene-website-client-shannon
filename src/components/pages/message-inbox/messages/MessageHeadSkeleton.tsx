import Skeleton from "@/components/custom/custom-skeleton";
import { BsThreeDots } from "react-icons/bs";
import { TbCurrentLocation } from "react-icons/tb";

const MessageHeadSkeleton = () => {
  return (
    <div className="w-full px-4 py-3.5 flex justify-between items-center gap-5 bg-white border-b">
      <div className="flex items-center gap-3 flex-shrink-0">
        <Skeleton width="64px" height="64px" className="rounded-2xl flex-shrink-0" />
        <div className="w-full space-y-2">
          <Skeleton width="128px" height="20px" className="rounded" />
          <div className="flex items-center gap-2">
            <TbCurrentLocation className="size-5 text-gray-400" />
            <Skeleton width="160px" height="16px" className="rounded" />
          </div>
        </div>
      </div>
      <div>
        <button className="p-2 rounded-full flex justify-center items-center">
          <BsThreeDots className="size-9 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default MessageHeadSkeleton;
