import CreatePost from "@/components/pages/home/create-post/create-post";
import { useParams } from "next/navigation";
import React from "react";
import GroupPost from "./GroupPost";

const GroupDiscussion = () => {
  const { groupId } = useParams();
  return (
    <section className="w-full space-y-5">
      <CreatePost postType="Group" groupId={groupId as string} />
      <GroupPost />
    </section>
  );
};

export default GroupDiscussion;
