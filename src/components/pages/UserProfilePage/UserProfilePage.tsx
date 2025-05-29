"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useGetSingleUserQuery } from "@/redux/features/users/userApi";
import NotFoundPage from "../not-found-page/not-found-page";
import Header from "@/components/common/header";
import UserProfileHeader from "./UserProfileHeader/UserProfileHeader";
import useUser from "@/hooks/useUser";
import MyProfileHeader from "./MyProfileHeader/MyProfileHeader";
import UserNavlinkTab from "./UserNavlinkTab/UserNavlinkTab";

const UserProfileInformationPage = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = useUser();
  const { userName } = useParams();
  const { data: responseData, isLoading } = useGetSingleUserQuery(userName, {
    refetchOnMountOrArgChange: true,
    skip: !userName,
  });
  const userData = responseData?.data?.attributes;
  const isMyProfile = user?._id === userData?._id;
  let content = null;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (!isLoading && !userData) {
    content = <NotFoundPage />;
  } else if (!isLoading && userData) {
    content = (
      <section className="w-full mx-auto bg-[#F5F5F5]">
        <Header />
        <div className="container mx-auto space-y-8 px-4 pb-10">
          {isMyProfile ? (
            <MyProfileHeader userData={userData} />
          ) : (
            <UserProfileHeader userData={userData} />
          )}
          <UserNavlinkTab isMyProfile={isMyProfile} />
          {children}
        </div>
      </section>
    );
  }
  return <section className="w-full">{content}</section>;
};

export default UserProfileInformationPage;
