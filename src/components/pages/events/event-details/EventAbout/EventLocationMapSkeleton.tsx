import Skeleton from "@/components/custom/custom-skeleton";

export const EvetLocationMapSkeleton = () => {
  return (
    <div className="w-full col-span-full md:col-span-5 bg-white p-4 rounded-xl space-y-2">
      {/* Map container */}
      <div className="rounded-xl shadow-md h-[272px] overflow-hidden relative">
        <Skeleton width="100%" height="100%" className="rounded-xl" />
      </div>

      {/* Location name */}
      <div className="flex items-start space-x-2">
        <span className="text-lg">📍</span>
        <Skeleton width="180px" height="1.4rem" />
      </div>
    </div>
  );
};
