import Skeleton from "@/components/custom/custom-skeleton";


export const EventAuthorDetailsSkeleton = () => {
  return (
    <div className="w-full col-span-full md:col-span-7 bg-white p-6 md:p-9 rounded-xl">
      {/* Title */}
      <Skeleton width="180px" height="2rem" />
      
      <div className="py-5">
        {/* Profile image */}
        <Skeleton 
          width="174px" 
          height="174px" 
          className="rounded-full mx-auto" 
        />
        
        {/* Author info */}
        <div className="mt-5">
          <Skeleton 
            width="200px" 
            height="2.5rem" 
            className="mx-auto" 
          />
          
          <div className="flex flex-wrap gap-2 items-center justify-center mt-2">
            <Skeleton width="100px" height="1rem" />
            <div className="size-1.5 bg-gray-200 rounded-full animate-pulse"></div>
            <Skeleton width="120px" height="1rem" />
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton width="100%" height="1.2rem" />
        <Skeleton width="90%" height="1.2rem" />
        <Skeleton width="70%" height="1.2rem" />
      </div>
    </div>
  );
};