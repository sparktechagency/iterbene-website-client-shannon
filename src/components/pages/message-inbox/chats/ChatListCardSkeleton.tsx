import Skeleton from "@/components/custom/custom-skeleton";

const ChatListCardSkeleton = () => {
  return (
    <div className="w-full p-4 flex rounded-xl items-center gap-3 animate-pulse bg-gray-100">
      {/* Profile Image Skeleton */}
      <Skeleton
        width="50px"
        height="50px"
        className="rounded-full flex-shrink-0"
      />
      <div className="w-full flex flex-col justify-between gap-2 text-sm">
        <Skeleton width="70%" height="0.7rem" className="rounded" />
        <Skeleton width="50%" height="0.4rem" className="rounded" />
      </div>

      {/* Last Message Preview Skeleton */}
      <Skeleton width="30%" height="0.8rem" className="rounded" />
    </div>
  );
};

export default ChatListCardSkeleton;
