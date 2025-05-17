import CustomButton from "@/components/custom/custom-button";
import Image from "next/image";
import React from "react";

const UserProfileHeader = () => {
  return (
    <div className="w-full bg-white rounded-2xl relative pt-[112px]">
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
          <CustomButton variant="default" className="px-8 py-3 mt-5" fullWidth>
            Follow
          </CustomButton>
          <CustomButton variant="outline" className="px-5 py-3 mt-5" fullWidth>
            Message
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
