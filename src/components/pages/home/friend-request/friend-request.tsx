import React from "react";
import FriendRequestCard from "./friend-request-card";
const FriendRequest: React.FC = () => {
  const requests = [
    { id: 1, name: "Turel Barrows", profileImage: "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg" },
    { id: 2, name: "Jane Doe", profileImage: "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg" },
    { id: 3, name: "John Smith", profileImage: "https://i.ibb.co.com/hFTPRsW0/0de9d1146da18068833210d399cd593e.jpg" },
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
