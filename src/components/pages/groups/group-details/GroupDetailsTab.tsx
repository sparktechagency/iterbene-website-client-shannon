"use client";
import { IGroupDetails } from "@/types/group.types";
import GroupDiscussion from "./GroupDiscussion/GroupDiscussion";

const GroupDetailsTab = ({
  groupDetailsData,
}: {
  groupDetailsData: IGroupDetails;
}) => {
  return (
    <section className="w-full py-8 ">
      <div className="w-full flex items-center gap-5  ">
        <button
          className={`px-8 py-2  rounded-xl text-primary bg-[#E9F8F9] border border-primary text-[16px] font-semibold cursor-pointer`}
        >
          Discussion
        </button>
      </div>
      <div className="w-full py-6">
        <GroupDiscussion groupDetailsData={groupDetailsData} />
      </div>
    </section>
  );
};

export default GroupDetailsTab;
