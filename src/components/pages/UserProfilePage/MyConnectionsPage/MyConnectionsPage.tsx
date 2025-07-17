"use client";
import { useState } from "react";
import MyConnections from "./MyConnections/MyConnections";
import MyRequestConnections from "./MyRequestConnections/MyRequestConnections";
import { IConnection, IConnectionRequest } from "@/types/connection.types";

const MyConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("My Connections");
  const [connections, setConnections] = useState<IConnection[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<
    IConnectionRequest[]
  >([]);
  const [connectionsPage, setConnectionsPage] = useState<number>(1);
  const [requestsPage, setRequestsPage] = useState<number>(1);
  const [hasMoreConnections, setHasMoreConnections] = useState<boolean>(true);
  const [hasMoreRequests, setHasMoreRequests] = useState<boolean>(true);

  return (
    <section className="w-full pb-20">
      {/* Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
        <div className="w-full flex space-x-4">
          <button
            onClick={() => setActiveTab("My Connections")}
            className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === "My Connections" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            My Connections
          </button>
          <button
            onClick={() => setActiveTab("Requests")}
            className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              activeTab === "Requests" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            Requests
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="w-full">
        {activeTab === "My Connections" ? (
          <MyConnections
            connections={connections}
            setConnections={setConnections}
            currentPage={connectionsPage}
            setCurrentPage={setConnectionsPage}
            hasMore={hasMoreConnections}
            setHasMore={setHasMoreConnections}
          />
        ) : (
          <MyRequestConnections
            connectionRequests={connectionRequests}
            setConnectionRequests={setConnectionRequests}
            currentPage={requestsPage}
            setCurrentPage={setRequestsPage}
            hasMore={hasMoreRequests}
            setHasMore={setHasMoreRequests}
          />
        )}
      </div>
    </section>
  );
};

export default MyConnectionsPage;
