import React from "react";
import FriendRequestCard from "./friend-request-card";

const FriendRequest: React.FC = () => {
  const requests = [
    { id: 1, name: "Lucas Bennett", profileImage: "https://randomuser.me/api/portraits/men/20.jpg" },
    { id: 2, name: "Amelia Foster", profileImage: "https://randomuser.me/api/portraits/women/21.jpg" },
    { id: 3, name: "Henry Nguyen", profileImage: "https://randomuser.me/api/portraits/men/22.jpg" },
  ];

  return (
    <section className="w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold uppercase">Request</h1>
        <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white">
          <span>{requests.length}</span>
        </div>
      </div>
      <div className="w-full space-y-6 mt-5">
        {requests.map((request) => (
          <FriendRequestCard key={request.id} request={request} />
        ))}
      </div>
    </section>
  );
};

export default FriendRequest;