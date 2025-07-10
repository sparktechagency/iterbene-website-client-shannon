import useUser from "@/hooks/useUser";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AuthorBio = () => {
  const user = useUser();
  return (
    <>
      {user && (
        <Link href={`/${user?.username}`} className="w-full block">
          <section className="w-full max-h-[108px] bg-white p-6 rounded-2xl">
            <div className="w-full h-full gap-3 flex items-center">
              {user && (
                <Image
                  src={user?.profileImage}
                  alt={user?.fullName}
                  width={60}
                  height={60}
                  className="size-[60px] rounded-full object-cover mr-3 ring-2 ring-primary"
                />
              )}

              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  {user?.fullName}
                </h2>
                <p className="text-[18px] text-gray-600">@{user?.username}</p>
              </div>
            </div>
          </section>
        </Link>
      )}
    </>
  );
};

export default AuthorBio;
