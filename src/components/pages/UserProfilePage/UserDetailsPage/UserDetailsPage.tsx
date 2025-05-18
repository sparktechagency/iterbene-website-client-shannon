"use client";

import useUser from "@/hooks/useUser";
import { useGetSingleUserQuery } from "@/redux/features/users/userApi";
import { useParams } from "next/navigation";
import MyProfileDetails from "./MyProfileDetails/MyProfileDetails";
import UserDetails from "./UserDetails/UserDetails";

const UserDetailsPage = () => {
  const user = useUser();
  const { userName } = useParams();
  const { data: responseData } = useGetSingleUserQuery(userName, {
    refetchOnMountOrArgChange: true,
    skip: !userName,
  });
  const userData = responseData?.data?.attributes;
  const isMyProfile =
    user?._id === userData?._id || user?.username === userData?.username;
  return <>{isMyProfile ? <MyProfileDetails /> : <UserDetails />}</>;
};

export default UserDetailsPage;
