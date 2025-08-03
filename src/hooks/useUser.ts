"use client";
import { useGetMyProfileQuery } from "@/redux/features/profile/profileApi";
import { getAccessToken, isTokenExpired } from "@/services/auth.services";
import { usePathname } from "next/navigation";

const useUser = () => {
  const pathName = usePathname();
  const isLoginPage = pathName === "/login" || pathName === "/register";
  const accessToken = getAccessToken();
  const { data: response, isError } = useGetMyProfileQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    // Only fetch data if the access token is valid
    skip: isLoginPage || !accessToken || isTokenExpired(accessToken),
  });
  if (isError || !response?.data?.attributes) {
    return null;
  }

  return response?.data?.attributes;
};

export default useUser;
