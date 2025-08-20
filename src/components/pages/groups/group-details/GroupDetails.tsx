"use client";
import React from "react";
import GroupDetailsHeader from "./GroupDetailsHeader/GroupDetailsHeader";
import GroupDetailsTab from "./GroupDetailsTab";
import { useParams } from "next/navigation";
import { useGetGroupQuery } from "@/redux/features/group/groupApi";
import GroupDetailsHeaderSkeleton from "./GroupDetailsHeader/GroupDetailsHeaderSkeleton";
import { GroupDetailsTabSkeleton } from "./GroupDetailsTabSkeleton";

const GroupDetails = () => {
  const { groupId } = useParams();
  const { data: responseData, isLoading } = useGetGroupQuery(groupId, {
    refetchOnMountOrArgChange: true,
    skip: !groupId,
  });
  const groupDetailsData = responseData?.data?.attributes;
  return (
    <>
      {isLoading ? (
        <GroupDetailsHeaderSkeleton />
      ) : (
        <GroupDetailsHeader groupDetailsData={groupDetailsData} />
      )}
      {isLoading ? (
        <GroupDetailsTabSkeleton />
      ) : (
        <GroupDetailsTab groupDetailsData={groupDetailsData} />
      )}
    </>
  );
};

export default GroupDetails;
