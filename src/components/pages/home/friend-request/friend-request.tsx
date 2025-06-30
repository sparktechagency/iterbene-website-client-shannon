"use client";
import { useGetConnectionRequestsQuery } from "@/redux/features/connections/connectionsApi";
import FriendRequestCard from "./friend-request-card";
import { IConnectionRequest } from "@/types/connection.types";
const FriendRequest = () => {
  const { data: responseData, isLoading } =
    useGetConnectionRequestsQuery(undefined,{
      refetchOnMountOrArgChange: true
    });
  const connectionsRequestData = responseData?.data?.attributes?.results;
  const requestCount = responseData?.data?.attributes?.requestCount;
  let content = null;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (!isLoading && connectionsRequestData?.length === 0) {
    content = <p className="text-xl">No requests found</p>;
  } else if (!isLoading && connectionsRequestData?.length > 0) {
    content = (
      <div className="w-full space-y-6">
        {connectionsRequestData
          ?.slice(0, 4)
          ?.map((request: IConnectionRequest) => (
            <FriendRequestCard key={request._id} request={request} />
          ))}
      </div>
    );
  }
  return (
    <>
      {connectionsRequestData?.length > 0 && (
        <section className="w-full pb-5 md:pb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold uppercase">Request</h1>
            {requestCount > 0 && (
              <div className="size-6 rounded-full bg-primary flex items-center justify-center text-white">
                <h1 className="text-sm font-semibold">{requestCount}</h1>
              </div>
            )}
          </div>
          <div className="mt-4">{content}</div>
        </section>
      )}
    </>
  );
};

export default FriendRequest;
