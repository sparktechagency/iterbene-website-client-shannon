import Skeleton from "@/components/custom/custom-skeleton";
import { GroupSummarySkeleton } from "./GroupAbout/GroupSummarySkeleton";
import { GroupParticipantsListSkeleton } from "./GroupAbout/GroupParticipantsListSkeleton";
import PostCardSkeleton from "../../home/posts/PostCardSkeleton";

export const GroupDetailsTabSkeleton = () => {
  return (
    <section className="w-full py-8">
      {/* Tab buttons */}
      <div className="w-full flex items-center gap-5">
        <Skeleton width="80px" height="40px" className="rounded-xl" />
      </div>

      {/* Tab content area */}
      <section
        className="w-full flex  gap-5"
      >
        <div className="w-full flex-col gap-5">
          <div className="w-full h-20 flex items-center justify-between px-4 py-5 rounded-2xl bg-white mt-2">
            <Skeleton width="50px" height="50px" className="rounded-full" />
            <Skeleton width="rem" height="2.5rem" className="rounded" />
          </div>
          <div className="w-full flex flex-col gap-5 mt-5">
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        </div>
        <div className="w-full hidden md:block max-w-[260px] md:max-w-[280px] xl:max-w-[320px] 2xl:max-w-[382px] space-y-5">
          <GroupSummarySkeleton />
          <GroupParticipantsListSkeleton />
        </div>
      </section>
    </section>
  );
};
