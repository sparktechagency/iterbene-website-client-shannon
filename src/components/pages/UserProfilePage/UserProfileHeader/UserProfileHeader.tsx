import CustomButton from "@/components/custom/custom-button";
import useUser from "@/hooks/useUser";
import { openAuthModal } from "@/redux/features/auth/authModalSlice";
import {
  useAddConnectionMutation,
  useCancelConnectionMutation,
  useCheckIsSentConnectionExistsQuery,
} from "@/redux/features/connections/connectionsApi";
import { TError } from "@/types/error";
import { IUser } from "@/types/user.types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const UserProfileHeader = ({ userData }: { userData: IUser }) => {
  const user = useUser();
  const dispatch = useDispatch();
  const router = useRouter();

  // add connection
  const [addConnection, { isLoading }] = useAddConnectionMutation();

  // cancel connection
  const [cancelConnection, { isLoading: isLoadingCancel }] =
    useCancelConnectionMutation();

  // check if sent connection exists
  const { data: responseData } = useCheckIsSentConnectionExistsQuery(
    userData?._id,
    {
      refetchOnMountOrArgChange: true,
      skip: !userData?._id || !user?._id,
    }
  );
  const isSentConnectionExists =
    responseData?.data?.attributes?.status === "pending";
  const isConnected = responseData?.data?.attributes?.status === "accepted";

  const handleAddConnection = async () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }
    try {
      const payload = { receivedBy: userData?._id };
      await addConnection(payload).unwrap();
      toast.success("Connection sent successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleCancelRequest = async () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }
    try {
      await cancelConnection(userData?._id).unwrap();
      toast.success("Request canceled successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleRedirectToChat = () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }
    router.push(`/messages/${userData?._id}`);
  };

  return (
    <div className="w-full bg-white rounded-2xl relative mt-[112px]">
      {userData?.coverImage && (
        <Image
          src={userData?.coverImage}
          alt="background"
          width={1600}
          height={360}
          className="w-full h-[200px] sm:h-[280px] md:h-[360px] object-cover rounded-t-2xl"
          priority
        />
      )}

      {userData?.profileImage && (
        <Image
          src={userData?.profileImage}
          alt="profile"
          width={174}
          height={174}
          className="block lg:absolute left-8 size-[174px] mx-auto -mt-[100px] object-cover rounded-full border-4 border-white flex-shrink-0"
          priority
        />
      )}

      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 lg:pl-[240px] p-7 md:p-10 ">
        <div className="space-y-1 flex-1">
          <h1 className="text-center md:text-left text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            {userData?.fullName}
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-3 text-gray-600 text-sm md:text-base font-medium">
            <span>@{userData?.username}</span>
            <span>· {userData?.followersCount} followers</span>
            <span>· {userData?.followingCount} following</span>
          </div>
        </div>
        <div className="w-full flex gap-7 justify-end flex-1">
          {isConnected ? (
            <CustomButton variant="default" className="px-8 py-3">
              Connected
            </CustomButton>
          ) : isSentConnectionExists ? (
            <CustomButton
              onClick={handleCancelRequest}
              loading={isLoadingCancel}
              variant="default"
              className="px-8 py-3"
            >
              Cancel Request
            </CustomButton>
          ) : (
            <CustomButton
              variant="default"
              onClick={handleAddConnection}
              loading={isLoading}
              className="px-8 py-3"
            >
              Connect
            </CustomButton>
          )}
          <CustomButton
            onClick={handleRedirectToChat}
            variant="outline"
            className="px-8 py-3"
          >
            Message
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
