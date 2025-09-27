"use client";
import Header from "@/components/common/Header";
import useUser from "@/hooks/useUser";
import { useGetSingleUserQuery } from "@/redux/features/users/userApi";
import { useParams } from "next/navigation";
import React from "react";
import NotFoundPage from "../not-found-page/not-found-page";
import MyProfileHeader from "./MyProfileHeader/MyProfileHeader";
import UserNavlinkTab from "./UserNavlinkTab/UserNavlinkTab";
import UserProfileHeader from "./UserProfileHeader/UserProfileHeader";
import UserProfileSkeleton from "./UserProfileSkeleton";

const UserProfileInformationPage = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = useUser();
  const { userName } = useParams();
  const { data: responseData, isLoading } = useGetSingleUserQuery(
    { userName,...user && { userId: user?._id } },
    {
      refetchOnMountOrArgChange: true,
      skip: !userName,
    }
  );
  const userData = responseData?.data?.attributes;
  const isMyProfile = user?._id === userData?._id;
  let content = null;
  if (isLoading) {
    content = (
      <section className="w-full mx-auto">
        <Header />
        <div className="container mx-auto space-y-8 px-4 pb-10">
          <UserProfileSkeleton />
        </div>
      </section>
    );
  } else if (!isLoading && !userData) {
    content = <NotFoundPage />;
  } else if (!isLoading && userData) {
    content = (
      <section className="w-full mx-auto">
        <Header />
        <div className="container mx-auto space-y-8 px-6 pb-10">
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
