import CreatePost from "@/components/pages/home/create-post/create-post";
import { useParams } from "next/navigation";
import React from "react";
import GroupPost from "./GroupPost";
import { IGroupDetails } from "@/types/group.types";
import GroupSummary from "../GroupAbout/GroupSummary";
import GroupParticipantsList from "../GroupAbout/GroupParticipantsList";

const GroupDiscussion = ({
  groupDetailsData,
}: {
  groupDetailsData: IGroupDetails;
}) => {
  const { groupId } = useParams();
  return (
    <section className="w-full flex gap-5">
      <div className="w-full space-y-5">
        <CreatePost postType="Group" groupId={groupId as string} />
        <GroupPost />
      </div>
      <div className="w-full max-w-[260px] md:max-w-[280px] xl:max-w-[320px] 2xl:max-w-[382px] space-y-5">
         <GroupSummary groupDetailsData={groupDetailsData} />
         <GroupParticipantsList groupDetailsData={groupDetailsData} />
      </div>
    </section>
  );
};

export default GroupDiscussion;
