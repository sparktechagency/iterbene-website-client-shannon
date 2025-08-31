"use client";
import { IGroupDetails } from "@/types/group.types";
import { useState } from "react";
import GroupAbout from "./GroupAbout/GroupAbout";
import GroupDiscussion from "./GroupDiscussion/GroupDiscussion";

const GroupDetailsTab = ({
  groupDetailsData
}: {
  groupDetailsData: IGroupDetails
}) => {
  const [activeTab, setActiveTab] = useState("discussion");
  return (
    <section className="w-full py-8 ">
      <div className="w-full flex items-center gap-5  ">
        <button
          onClick={() => setActiveTab("discussion")}
          className={`px-8 py-2  rounded-xl ${
            activeTab === "discussion"
              ? "text-primary bg-[#E9F8F9] border border-primary"
              : "text-black "
          } text-[16px] font-semibold cursor-pointer`}
        >
          Discussion
        </button>
      </div>
      <div className="w-full py-6">
        {activeTab === "about" ? (
          <GroupAbout groupDetailsData={groupDetailsData} />
        ) : (
          <GroupDiscussion groupDetailsData={groupDetailsData} />
        )}
      </div>
    </section>
  );
};

export default GroupDetailsTab;
