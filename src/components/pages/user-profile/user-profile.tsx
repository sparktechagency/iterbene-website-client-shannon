import { Tabs } from "antd";
import Image from "next/image";
import React from "react";
import UserDetailsTab from "./user-details-tab/user-details-tab";
import UserTimelineTab from "./user-timeline-tab/user-timeline-tab";
import UserVideoTab from "./user-video-tab/user-video.tab";
import UserPhotosTab from "./user-photos-tab/user-photos-tab";
import UserItineraryTab from "./user-itinerary-tab";
import CustomButton from "@/components/custom/custom-button";

const UserProfile = () => {
  const tabItems = [
    {
      key: "1",
      label: "Profile",
      children: <UserDetailsTab />,
    },
    {
      key: "2",
      label: "Timeline",
      children: <UserTimelineTab />,
    },
    {
      key: "3",
      label: "Videos",
      children: <UserVideoTab />,
    },
    {
      key: "4",
      label: "Photos",
      children: <UserPhotosTab />,
    },
    {
      key: "5",
      label: "Itinerary",
      children: <UserItineraryTab />,
    },
  ];
  return (
    <section className="w-full min-h-screen px-5 bg-[#F5F5F5] pb-10">
      <div className="container mx-auto">
        <div className="w-full bg-white rounded-2xl relative">
          {/* Background Image */}
          <Image
            src="https://i.ibb.co.com/VYZRgvqT/background-image.jpg"
            alt="background"
            width={1600}
            height={360}
            className="w-full h-[200px] sm:h-[280px] md:h-[360px] object-cover rounded-t-2xl"
          />
          <Image
            src="https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg"
            alt="profile"
            width={174}
            height={174}
            className="block lg:absolute left-8 size-[174px] mx-auto  -mt-[100px] object-cover rounded-full border-4 border-white flex-shrink-0"
          />
          {/* Profile Section */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8  lg:pl-[240px] p-7 md:p-10 ">
            <div className="space-y-1 ">
              <h1 className="text-center md:text-left text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                Alexandra Broke
              </h1>
              <div className="flex flex-wrap gap-2 sm:gap-3 text-gray-600 text-xs sm:text-sm">
                <span>@alexandrabroke</span>
                <span>· 51M followers</span>
                <span>· 3 following</span>
              </div>
            </div>
            <div className="flex gap-7">
              <CustomButton
                variant="default"
                className="px-8 py-3 mt-5"
                fullWidth
              >
                Follow
              </CustomButton>
              <CustomButton
                variant="outline"
                className="px-5 py-3 mt-5"
                fullWidth
              >
                Message
              </CustomButton>
            </div>
          </div>
        </div>
        {/* Tabs Section */}
        <div className="w-full mt-5">
          <Tabs
            defaultActiveKey="1"
            type="line"
            items={tabItems}
            tabBarStyle={{
              marginBottom: "24px",
              color: "#8C8C8C", // Match the inactive tab color
            }}
            className="custom-tabs"
          />
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
