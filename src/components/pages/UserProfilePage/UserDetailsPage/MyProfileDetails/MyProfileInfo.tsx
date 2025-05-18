import { IUser } from "@/types/user.types";
import moment from 'moment'
const MyProfileInfo = ({ userData }: { userData: IUser }) => {
  return (
    <div className="space-y-[32px] mt-10">
      <div className="flex flex-col md:flex-row gap-1 md:gap-5">
        <h1 className="w-full md:w-96  font-medium text-[#9194A9] text-[16px]">
          Full name
        </h1>
        <h1 className="w-full md:w-96  text-[#9194A9]">{userData?.fullName}</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-5">
        <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]">
          Nick name
        </h1>
        <h1 className="text-[#9194A9]">{userData?.nickname || "--"}</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-5">
        <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]">
          Username
        </h1>
        <h1 className="text-[#9194A9]">{userData?.username}</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-5">
        <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]">
          Joined
        </h1>
        <h1 className="text-[#9194A9]">
         {userData?.createdAt && moment(userData?.createdAt).fromNow()}
        </h1>
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-5">
        <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]">
          Email
        </h1>
        <h1 className="text-[#9194A9]">{userData?.email}</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-5">
        <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]">
          Phone Number
        </h1>
        <h1 className="text-[#9194A9]">{userData?.phoneNumber}</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-5">
        <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]">
          Country
        </h1>
        <h1 className="text-[#9194A9]">{userData?.country}</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-5">
        <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]">
          City
        </h1>
        <h1 className="text-[#9194A9]">{userData?.city}</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-5">
        <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]">
          State
        </h1>
        <h1 className="text-[#9194A9]">{userData?.state}</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-5">
        <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]">
          Referred as
        </h1>
        <h1 className="text-[#9194A9]">{userData?.referredAs}</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-5">
        <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]">
          Age range
        </h1>
        <h1 className="text-[#9194A9]">{userData?.ageRange}</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-5">
        <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]">
          Profession
        </h1>
        <h1 className="text-[#9194A9]">{userData?.profession}</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-5">
        <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]">
          Relationship Status
        </h1>
        <h1 className="text-[#9194A9]">{userData?.maritalStatus}</h1>
      </div>
    </div>
  );
};

export default MyProfileInfo;
