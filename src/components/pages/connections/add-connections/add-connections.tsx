"use client";
import AddConnectionCard from "./add-connection.card";
import { IConnection } from "@/types/connection.types";
import { useGetSuggestionsConnectionsQuery } from "@/redux/features/connections/connectionsApi";
const AddConnections = () => {
  const { data: responseData, isLoading } = useGetSuggestionsConnectionsQuery(undefined);
  const suggestionsConnections = responseData?.data?.attributes?.results;
  let content = null;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (!isLoading && suggestionsConnections?.length === 0) {
    content = <p>No requests found</p>;
  } else if (!isLoading && suggestionsConnections?.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {suggestionsConnections?.slice(0, 4)?.map((connection: IConnection) => (
          <AddConnectionCard
            key={connection?.id}
            connection={connection}
          />
        ))}
      </div>
    );
  }
  return (
    <section>
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-5 px-2">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          People You Might Like
        </h1>
        <button className="text-primary hover:underline">Show more</button>
      </div>
      {/* Content Section */}
      {content}
    </section>
  );
};

export default AddConnections;
