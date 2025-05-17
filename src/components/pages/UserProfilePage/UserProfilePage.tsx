"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useGetSingleUserQuery } from "@/redux/features/users/userApi";
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
  return (
    <section className="w-full bg-[#F5F5F5]">
      <Header />
      <div className="container mx-auto space-y-8 pb-10">
        <UserProfileHeader />
        {children}
      </div>
    </section>
  );
};

export default UserProfileInformationPage;
