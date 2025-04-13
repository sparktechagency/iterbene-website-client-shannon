import Image from "next/image";
import React from "react";

const AuthorBio = () => {
  const user = {
    fullName: "Md Rakib Ali",
    profileImage: {
      imageUrl:
        "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg",
    },
    userName: "@mdrakibali",
  };
  return (
    <section className="w-full max-h-[108px] bg-white p-6 rounded-2xl">
      <div className="w-full h-full gap-3 flex items-center">
        <Image
          src={user?.profileImage?.imageUrl}
          alt={user.fullName}
          width={60}
          height={60}
          className="size-[60px] rounded-full object-cover mr-3 ring-2 ring-[#40E0D0]"
        />
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            {user.fullName}
          </h2>
          <p className="text-[18px] text-gray-600">{user.userName}</p>
        </div>
      </div>
    </section>
  );
};

export default AuthorBio;
