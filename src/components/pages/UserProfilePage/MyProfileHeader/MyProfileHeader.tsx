import { IUser } from "@/types/user.types";
import { getFullName } from "@/utils/nameUtils";
import Image from "next/image";
import React from "react";

const MyProfileHeader = ({userData} : {userData: IUser}) => {
  return (
    <div className="w-full bg-white rounded-2xl relative mt-[72px] md:mt-[88px] lg:mt-[112px]">
      {/* Background Image */}
      {userData?.coverImage && (
        <Image
          src={userData?.coverImage}
          alt="background"
          width={1600}
          height={360}
          className="w-full h-[200px] sm:h-[280px] md:h-[360px] object-cover rounded-t-2xl"
        />
      )}

      {userData?.profileImage && (
        <Image
          src={userData?.profileImage}
          alt="profile"
          width={174}
          height={174}
          className="block lg:absolute left-8  size-[140px] md:size-[174px] lg:size-[174px] mx-auto -mt-[80px] lg:-mt-[100px] object-cover rounded-full border-4 border-white flex-shrink-0"
        />
      )}
      {/* Profile Section */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8  lg:pl-[240px] p-7 md:p-10 ">
        <div className="space-y-1 ">
          {/* User full name */}
          <h1 className="text-center md:text-left text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            {getFullName(userData)}
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-3 text-gray-600 text-sm md:text-base font-medium">
            <span>@{userData?.username}</span>
            <span>· {userData?.followersCount} followers</span>
            <span>· {userData?.followingCount} following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileHeader;
