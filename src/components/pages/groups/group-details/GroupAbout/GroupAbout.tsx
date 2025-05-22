
import GroupSummary from "./GroupSummary";
import GroupLocationMap from "./GroupLocationMap";
import GroupAuthorDetails from "./GroupAuthorDetails";
import GroupParticipantsList from "./GroupParticipantsList";
import { IGroup } from "@/types/group";

const GroupAbout = ({groupDetailsData} : {groupDetailsData: IGroup}) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
      <GroupSummary groupDetailsData={groupDetailsData} />
      <GroupLocationMap groupDetailsData={groupDetailsData} />
      <GroupAuthorDetails groupDetailsData={groupDetailsData} />
      <GroupParticipantsList groupDetailsData={groupDetailsData} />
    </div>
  );
};

export default GroupAbout;
