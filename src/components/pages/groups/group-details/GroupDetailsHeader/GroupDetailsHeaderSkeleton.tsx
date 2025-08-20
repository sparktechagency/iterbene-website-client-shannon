import Skeleton from "@/components/custom/custom-skeleton";


const GroupDetailsHeaderSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-xl relative">
      {/* Group Image Skeleton */}
      <Skeleton
        height="360px"
        className="w-full sm:h-[280px] md:h-[360px] rounded-t-2xl"
      />

      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 px-[24px] md:px-[40px] py-[24px] md:py-[36px]">
        {/* Group Info Section */}
        <div className="space-y-2">
          {/* Group Name Skeleton */}
          <Skeleton width="280px" height="2rem" className="mx-auto md:mx-0" />

          {/* Group Details Skeleton */}
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center md:justify-start">
            {/* Icon Skeleton */}
            <Skeleton width="20px" height="20px" className="rounded" />

            {/* Privacy Text Skeleton */}
            <Skeleton width="80px" height="1rem" />

            {/* Dot */}
            <div className="size-2 bg-gray-200 rounded-full animate-pulse"></div>

            {/* Member Count Skeleton */}
            <Skeleton width="90px" height="1rem" />
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex gap-5">
          {/* Invite Button Skeleton */}
          <Skeleton width="100px" height="48px" className="rounded-xl" />

          {/* Leave/Remove Button Skeleton */}
          <Skeleton width="90px" height="48px" className="rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsHeaderSkeleton;
