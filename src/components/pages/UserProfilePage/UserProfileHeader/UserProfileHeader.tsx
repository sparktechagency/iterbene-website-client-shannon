import CustomButton from "@/components/custom/custom-button";
import useUser from "@/hooks/useUser";
import { openAuthModal } from "@/redux/features/auth/authModalSlice";
import {
  useAddConnectionMutation,
  useCancelConnectionMutation,
  useCheckIsSentConnectionExistsQuery,
  useAcceptConnectionMutation,
} from "@/redux/features/connections/connectionsApi";
import { TError } from "@/types/error";
import { IUser } from "@/types/user.types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const UserProfileHeader = ({ userData }: { userData: IUser }) => {
  const user = useUser();
  const dispatch = useDispatch();
  const router = useRouter();



  // API hooks
  const [addConnection, { isLoading: isLoadingAdd }] =
    useAddConnectionMutation();
  const [cancelConnection, { isLoading: isLoadingCancel }] =
    useCancelConnectionMutation();
  const [acceptConnection, { isLoading: isLoadingAccept }] =
    useAcceptConnectionMutation();
  const { data: responseData, isLoading: isLoadingCheck } =
    useCheckIsSentConnectionExistsQuery(userData?._id, {
      refetchOnMountOrArgChange: true,
      skip: !userData?._id || !user?._id,
    });

  const isSentConnectionExists =
    responseData?.data?.attributes?.status === "pending" &&
    responseData?.data?.attributes?.sentBy === user?._id;
  const isReceivedConnectionExists =
    responseData?.data?.attributes?.status === "pending" &&
    responseData?.data?.attributes?.receivedBy === user?._id;
  const isConnected = responseData?.data?.attributes?.status === "accepted";

  // Handle adding a connection
  const handleAddConnection = async () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }
    try {
      const payload = { receivedBy: userData?._id };
      await addConnection(payload).unwrap();
      toast.success("Connection request sent successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Failed to send connection request!");
    }
  };

  // Handle canceling a connection request
  const handleCancelRequest = async () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }
    try {
      await cancelConnection(userData?._id).unwrap();
      toast.success("Connection request canceled successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Failed to cancel connection request!");
    }
  };

  // Handle accepting a connection request
  const handleAcceptConnection = async () => {
    if (!user || !responseData?.data?.attributes?._id) {
      dispatch(openAuthModal());
      return;
    }
    try {
      await acceptConnection(responseData.data.attributes._id).unwrap();
      toast.success("Connection request accepted successfully!");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Failed to accept connection request!");
    }
  };

  // Handle redirect to chat
  const handleRedirectToChat = () => {
    if (!user) {
      dispatch(openAuthModal());
      return;
    }
    router.push(`/messages/${userData?._id}`);
  };

  return (
    <div className="w-full bg-white rounded-2xl relative mt-[112px] overflow-hidden">
      {/* Cover Image */}
      {userData?.coverImage && (
        <div className="relative w-full h-[200px] sm:h-[280px] md:h-[360px] overflow-hidden">
          <Image
            src={userData.coverImage}
            alt="Cover"
            fill
            className="object-cover rounded-t-2xl transition-transform duration-300"
            priority
          />
        </div>
      )}

      {/* Profile Image */}
      <div className="flex justify-center lg:justify-start lg:pl-8">
        {userData?.profileImage && (
          <div className="relative -mt-[100px] lg:-mt-[120px]">
            <Image
              src={userData.profileImage}
              alt="Profile"
              width={174}
              height={174}
              className="size-[174px] object-cover rounded-full border-4 border-white shadow-md transition-transform duration-300 "
              priority
            />
          </div>
        )}
      </div>

      {/* Profile Info and Buttons */}
      <div className="w-full flex -mt-13 flex-col md:flex-row justify-between items-center gap-4 md:gap-8 lg:pl-[240px] p-8 md:p-10">
        <div className="space-y-2 flex-1 text-center md:text-left">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
            {userData?.fullName}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 text-gray-600 text-sm md:text-base font-medium">
            <span className="hover:text-blue-600 transition-colors">
              @{userData?.username}
            </span>
            <span>·</span>
            <span>{userData?.followersCount} followers</span>
            <span>·</span>
            <span>{userData?.followingCount} following</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-wrap justify-center md:justify-end gap-3 md:gap-4 flex-1">
          {isLoadingCheck ? (
            <CustomButton variant="outline" className="px-8 py-3" disabled>
              Loading...
            </CustomButton>
          ) : isConnected ? (
            <CustomButton
              variant="outline"
              className="px-8 py-3 border-green-500 text-green-500 hover:bg-green-50 transition-colors"
            >
              ✓ Connected
            </CustomButton>
          ) : isSentConnectionExists ? (
            <CustomButton
              onClick={handleCancelRequest}
              loading={isLoadingCancel}
              variant="outline"
              className="px-8 py-3 border-red-500 text-red-500 hover:bg-red-50 transition-colors"
            >
             ✗ Cancel
            </CustomButton>
          ) : isReceivedConnectionExists ? (
            <CustomButton
              onClick={handleAcceptConnection}
              loading={isLoadingAccept}
              variant="default"
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
             ✓ Accept
            </CustomButton>
          ) : (
            <CustomButton
              variant="default"
              onClick={handleAddConnection}
              loading={isLoadingAdd}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Connect
            </CustomButton>
          )}
          <CustomButton
            onClick={handleRedirectToChat}
            variant="outline"
            className="px-8 py-3 border-gray-500 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Message
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
