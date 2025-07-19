import Skeleton from "@/components/custom/custom-skeleton";

const JourneyViewSkeleton = () => {
  return (
    <div className="relative bg-slate-50 opacity-45 w-full h-full max-w-md">
      {/* Progress bars skeleton */}
      <div className="absolute top-2 left-2 right-2 z-30 flex gap-1">
        {[1, 2, 3].map((_, index) => (
          <Skeleton
            key={index}
            height="0.5rem"
            className="flex-1 rounded-full"
          />
        ))}
      </div>

      {/* Header skeleton */}
      <div className="absolute top-6 left-2 right-2 z-30 flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          <Skeleton width="2rem" height="2rem" className="rounded-full" />
          <Skeleton width="6rem" height="1rem" />
          <Skeleton width="4rem" height="0.75rem" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton width="2rem" height="2rem" className="rounded-full" />
        </div>
      </div>


      {/* Bottom section skeleton */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4">
        <div className="flex items-center gap-3">
          <Skeleton width="80%" height="2.5rem" className="rounded-full" />
          <Skeleton width="2rem" height="2rem" className="rounded-full" />
          <Skeleton width="2rem" height="2rem" className="rounded-full" />
        </div>
      </div>

      {/* Desktop navigation arrows skeleton */}
      <div className="hidden md:block">
        <Skeleton
          width="2.5rem"
          height="2.5rem"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full"
        />
        <Skeleton
          width="2.5rem"
          height="2.5rem"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full"
        />
      </div>
    </div>
  );
};

export default JourneyViewSkeleton;
