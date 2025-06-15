import Skeleton from "@/components/custom/custom-skeleton";

const ChatListCardSkeleton = () => {
  return (
    <div className="w-full px-4 py-3 flex rounded-xl items-center gap-3 animate-pulse bg-gray-100">
      {/* Profile Image Skeleton */}
      <Skeleton width="50px" height="50px" className="rounded-full flex-shrink-0" />

      <div className="w-full space-y-2">
        {/* Name & Timestamp Skeleton */}
        <div className="flex justify-between items-center gap-2 text-sm">
          <Skeleton width="30%" height="1rem" className="rounded" />
          <Skeleton width="40px" height="0.8rem" className="rounded" />
        </div>

        {/* Last Message Preview Skeleton */}
        <Skeleton width="60%" height="0.8rem" className="rounded" />
      </div>
    </div>
  );
};

export default ChatListCardSkeleton;
