"use client";

import { useState } from "react";
import EventAbout from "./EventAbout/EventAbout";
import GroupDiscussion from "./EventDiscussion/EventDiscussion";
import { IEventDetails } from "@/types/event.types";

const EventDetailsTab = ({ eventDetailsData }: { eventDetailsData: IEventDetails }) => {
  const [activeTab, setActiveTab] = useState("about");
  return (
    <section className="w-full px-3 py-8 ">
      <div className="w-full flex items-center gap-5 ">
        <button
          onClick={() => setActiveTab("about")}
          className={`px-8 py-2  rounded-xl ${activeTab === "about"
            ? "text-primary bg-[#E9F8F9] border border-primary"
            : "text-black "
            } text-[16px] font-semibold cursor-pointer`}
        >
          About
        </button>
        <button
          onClick={() => setActiveTab("discussion")}
          className={`px-8 py-2  rounded-xl ${activeTab === "discussion"
            ? "text-primary bg-[#E9F8F9] border border-primary"
            : "text-black "
            } text-[16px] font-semibold cursor-pointer`}
        >
          Discussion
        </button>
      </div>
      <div className="w-full py-6">
        {activeTab === "about" ? <EventAbout eventDetailsData={eventDetailsData} /> : <GroupDiscussion eventDetailsData={eventDetailsData}  />}
      </div>
    </section>
  );
};

export default EventDetailsTab;
