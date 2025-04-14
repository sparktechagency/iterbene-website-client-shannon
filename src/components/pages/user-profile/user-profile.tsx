import Image from "next/image";
import React from "react";

const UserProfile = () => {
  return (
    <section className="w-full min-h-screen px-5 bg-[#F5F5F5] ">
      <div className="container">
        <div className="w-full bg-white rounded-2xl">
          {/* Background Image */}
          <Image
            src="https://i.ibb.co.com/VYZRgvqT/background-image.jpg"
            alt="background"
            width={1600}
            height={360}
            className="w-full h-[360px] object-cover rounded-t-2xl"
          />

          {/* Profile Section */}
          <div className="relative w-full flex gap-5 ">
            {/* Profile Picture */}
            <Image
              src="https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg"
              alt="profile"
              width={174}
              height={174}
              className="w-[174px] h-[174px] object-cover rounded-full border-4 border-white"
            />
            {/* User Info */}
            <div className="px-5 @md:px-[250px] pt-[32px] pb-[48px]">
              <h1 className="text-2xl font-bold text-gray-800">
                Alexandra Broke
              </h1>
              <div className="flex gap-2 text-gray-600 text-sm">
                <span>@alexandrabroke</span>
                <span>· 51M followers</span>
                <span>· 3 following</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
