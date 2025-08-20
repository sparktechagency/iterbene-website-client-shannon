import Skeleton from "@/components/custom/custom-skeleton";

export const GroupParticipantsListSkeleton = () => {
  return (
    <div className="w-full col-span-full md:col-span-5 bg-white p-6 md:p-8 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton width="130px" height="2rem" />
      </div>

      {/* Participants list */}
      <div className="w-full max-h-[300px] scrollbar-hide overflow-y-auto space-y-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Profile image */}
            <Skeleton width="48px" height="48px" className="rounded-full" />
            
            {/* User info */}
            <div className="space-y-1">
              <Skeleton width="120px" height="1rem" />
              <Skeleton width="80px" height="0.8rem" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};