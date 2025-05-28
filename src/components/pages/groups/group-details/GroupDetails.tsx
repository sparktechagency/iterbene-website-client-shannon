"use client";
import React from "react";
import GroupDetailsHeader from "./GroupDetailsHeader/GroupDetailsHeader";
import GroupDetailsTab from "./GroupDetailsTab";
import { useParams } from "next/navigation";
import { useGetGroupQuery } from "@/redux/features/group/groupApi";

const GroupDetails = () => {
  const { groupId } = useParams();
  const { data: responseData } = useGetGroupQuery(groupId, {
    refetchOnMountOrArgChange: true,
    skip: !groupId,
  });
  const groupDetailsData = responseData?.data?.attributes;
  return (
    <>
      <GroupDetailsHeader groupDetailsData={groupDetailsData} />
      <GroupDetailsTab groupDetailsData={groupDetailsData} />
    </>
  );
};

export default GroupDetails;
