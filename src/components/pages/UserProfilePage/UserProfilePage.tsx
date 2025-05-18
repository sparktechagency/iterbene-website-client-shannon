"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useGetSingleUserQuery } from "@/redux/features/users/userApi";
import NotFoundPage from "../not-found-page/not-found-page";
import Header from "@/components/common/header";
import UserProfileHeader from "./UserProfileHeader";

const UserProfileInformationPage = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { userName } = useParams();
  const { data: responseData } = useGetSingleUserQuery(userName, {
    refetchOnMountOrArgChange: true,
    skip: !userName,
  });
  const userData = responseData?.data?.attributes;
  return (
    <>
      {userData ? (
        <section className="w-full bg-[#F5F5F5]">
          <Header />
          <div className="container mx-auto space-y-8 pb-10">
            <UserProfileHeader userData={userData} />
            {children}
          </div>
        </section>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
};

export default UserProfileInformationPage;
