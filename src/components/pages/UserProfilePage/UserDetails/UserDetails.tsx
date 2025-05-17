const UserDetails = () => {
  // User details data
  const userDetails = {
    firstName: "Alexandra",
    lastName: "Broke",
    nickName: "",
    username: "@alexandrabroke",
    joined: "May 2023",
    email: "alexandrabroke@gmail.com",
    phoneNumber: "+1233334444",
    cityAndState: "Washington, D.C.",
    referredAs: "She/Her",
    ageRange: "25-34",
    profession: "Student",
    relationshipStatus: "Single",
  };

  return (
    <div className="w-full bg-white p-6 rounded-2xl">
      {/* Header with Title and Edit Button */}
      <div className="flex justify-between mb-4 border-b border-[#B5B7C5] pb-4">
        <h2 className="text-lg font-semibold text-gray-800">Details</h2>
      </div>

      {/* User Details List */}
      <div className="space-y-[32px] mt-10">
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className="w-full md:w-96  font-medium text-[#9194A9] text-[16px]" >First name</h1>
          <h1 className="w-full md:w-96  text-[#9194A9]">{userDetails.firstName}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]" >Last name</h1>
          <h1 className="text-[#9194A9]">{userDetails.lastName}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]" >Nick name</h1>
          <h1 className="text-[#9194A9]">{userDetails.nickName || "--"}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]" >Username</h1>
          <h1 className="text-[#9194A9]">{userDetails.username}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]" >Joined</h1>
          <h1 className="text-[#9194A9]">{userDetails.joined}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]" >Email</h1>
          <h1 className="text-[#9194A9]">{userDetails.email}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]" >Phone Number</h1>
          <h1 className="text-[#9194A9]">{userDetails.phoneNumber}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]" >City and State</h1>
          <h1 className="text-[#9194A9]">{userDetails.cityAndState}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]" >Referred as</h1>
          <h1 className="text-[#9194A9]">{userDetails.referredAs}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]" >Age range</h1>
          <h1 className="text-[#9194A9]">{userDetails.ageRange}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]" >Profession</h1>
          <h1 className="text-[#9194A9]">{userDetails.profession}</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-1 md:gap-5">
          <h1 className=" w-full md:w-96  font-medium text-[#9194A9] text-[16px]" >Relationship Status</h1>
          <h1 className="text-[#9194A9]">{userDetails.relationshipStatus}</h1>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;