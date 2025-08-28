"use client";
import { useGetMyProfileQuery } from "@/redux/features/profile/profileApi";
import { isAuthenticated } from "@/utils/tokenManager";
import { usePathname } from "next/navigation";

const useUser = () => {
  const pathName = usePathname();
  const isAuthPage = pathName === "/auth" || pathName === "/login" || pathName === "/register" || pathName === "/verify-email" || pathName === "/forgot-password" || pathName === "/reset-password";
  const userIsAuthenticated = isAuthenticated();
  
  const { data: response, isError } = useGetMyProfileQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    // Only fetch data if user is authenticated and not on auth pages
    skip: isAuthPage || !userIsAuthenticated,
  });
  
  if (isError || !response?.data?.attributes) {
    return null;
  }

  return response?.data?.attributes;
};

export default useUser;
