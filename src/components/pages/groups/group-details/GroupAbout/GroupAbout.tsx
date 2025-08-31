
import { IGroupDetails } from "@/types/group.types";
import GroupAuthorDetails from "./GroupAuthorDetails";
import GroupParticipantsList from "./GroupParticipantsList";
import GroupSummary from "./GroupSummary";

const GroupAbout = ({ groupDetailsData }: { groupDetailsData: IGroupDetails }) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
      <GroupSummary groupDetailsData={groupDetailsData} />
      <GroupAuthorDetails groupDetailsData={groupDetailsData} />
      <GroupParticipantsList groupDetailsData={groupDetailsData} />
    </div>
  );
};

export default GroupAbout;
