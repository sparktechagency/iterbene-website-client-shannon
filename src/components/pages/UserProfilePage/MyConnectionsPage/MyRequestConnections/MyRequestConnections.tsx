"use client";
import { useGetConnectionRequestsQuery } from "@/redux/features/connections/connectionsApi";
import { IConnectionRequest } from "@/types/connection.types";
import MyRequestConnectionCard from "./MyRequestConnectionCard";

const RequestConnections = () => {
  const { data: responseData, isLoading } =
    useGetConnectionRequestsQuery(undefined);
  const connectionsRequestData = responseData?.data?.attributes?.results;
  let content = null;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (!isLoading && connectionsRequestData?.length === 0) {
    content = <p className="text-xl">No requests found</p>;
  } else if (!isLoading && connectionsRequestData?.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-7">
        {connectionsRequestData?.map((request: IConnectionRequest) => (
          <MyRequestConnectionCard key={request?._id} connection={request} />
        ))}
      </div>
    );
  }
  return <div>{content}</div>;
};

export default RequestConnections;
