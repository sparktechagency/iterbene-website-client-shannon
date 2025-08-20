import Skeleton from "@/components/custom/custom-skeleton";

export const GroupSummarySkeleton = () => {
  return (
    <div className="w-full col-span-full md:col-span-7 bg-white p-8 rounded-xl">
      <div className="w-full space-y-5">
        {/* People count row */}
        <div className="flex items-center gap-4">
          <Skeleton width="24px" height="24px" className="rounded" />
          <Skeleton width="100px" height="1rem" />
        </div>

        {/* Created by row */}
        <div className="flex items-center gap-4">
          <Skeleton width="24px" height="24px" className="rounded-full" />
          <div className="flex items-center gap-2">
            <Skeleton width="80px" height="1rem" />
            <Skeleton width="120px" height="1.2rem" />
          </div>
        </div>

        {/* Location row */}
        <div className="flex items-center gap-4">
          <Skeleton width="24px" height="24px" className="rounded" />
          <Skeleton width="150px" height="1rem" />
        </div>
      </div>

      {/* Description */}
      <div className="mt-7 space-y-2">
        <Skeleton width="100%" height="1.2rem" />
        <Skeleton width="80%" height="1.2rem" />
        <Skeleton width="60%" height="1.2rem" />
      </div>
    </div>
  );
};
