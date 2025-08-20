import Skeleton from "@/components/custom/custom-skeleton";
import { EventSummarySkeleton } from "./EventAbout/EventSummarySkeleton";
import { EventParticipantsListSkeleton } from "./EventAbout/EventParticipantsListSkeleton";
import { EvetLocationMapSkeleton } from "./EventAbout/EventLocationMapSkeleton";
import { EventAuthorDetailsSkeleton } from "./EventAbout/EventAuthorDetailsSkeleton";

export const EventDetailsTabSkeleton = () => {
  return (
    <section className="w-full py-8">
      {/* Tab buttons */}
      <div className="w-full flex items-center gap-5">
        <Skeleton width="80px" height="40px" className="rounded-xl" />
        <Skeleton width="100px" height="40px" className="rounded-xl" />
      </div>

      {/* Tab content area */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 mt-5">
        <EventSummarySkeleton />
        <EvetLocationMapSkeleton />
        <EventAuthorDetailsSkeleton />
        <EventParticipantsListSkeleton />
      </div>
    </section>
  );
};
