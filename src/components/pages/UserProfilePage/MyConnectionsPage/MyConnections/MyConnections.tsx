"use client";
import MyConnectionCard from "./MyConnectionCard";
import { useGetMyConnectionsQuery } from "@/redux/features/connections/connectionsApi";
import { IConnection } from "@/types/connection.types";
const MyConnections: React.FC = () => {
  const { data: responseData, isLoading } = useGetMyConnectionsQuery({
    page: 1,
    limit: 10,
  });
  const myConnections = responseData?.data?.attributes?.results;
  let content = null;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (myConnections?.length === 0) {
    content = (
      <p className="text-center text-gray-500">No connections found.</p>
    );
  } else if (myConnections?.length > 0) {
    content = (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-7">
        {myConnections.map((connection: IConnection, index: number) => (
          <MyConnectionCard key={index} connection={connection} />
        ))}
      </div>
    );
  }

  return (
    <section className="w-full mx-auto">
      {content}
    </section>
  );
};

export default MyConnections;
