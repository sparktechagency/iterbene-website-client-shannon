import Skeleton from "@/components/custom/custom-skeleton";
import { GroupSummarySkeleton } from "./GroupAbout/GroupSummarySkeleton";
import { GroupAuthorDetailsSkeleton } from "./GroupAbout/GroupAuthorDetailsSkeleton";
import { GroupParticipantsListSkeleton } from "./GroupAbout/GroupParticipantsListSkeleton";

export const GroupDetailsTabSkeleton = () => {
  return (
    <section className="w-full py-8">
      {/* Tab buttons */}
      <div className="w-full flex items-center gap-5">
        <Skeleton width="80px" height="40px" className="rounded-xl" />
        <Skeleton width="100px" height="40px" className="rounded-xl" />
      </div>

      {/* Tab content area */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 mt-5">
        <GroupSummarySkeleton /> 
        <GroupAuthorDetailsSkeleton />
        <GroupParticipantsListSkeleton />
      </div>
    </section>
  );
};
