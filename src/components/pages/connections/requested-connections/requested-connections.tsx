'use client';
import React, { useEffect, useState } from "react";
import RequestedConnectionCard from "./requested-connection-card";

// Define the interface for the connection data
interface Connection {
  id: number;
  name: string;
  image: string;
}

// Define the interface for the API response
interface RandomUser {
  name: {
    first: string;
    last: string;
  };
  picture: {
    large: string;
  };
}

const RequestedConnections: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);

  // Fetch random users when the component mounts
  useEffect(() => {
    const fetchRandomUsers = async () => {
      try {
        const response = await fetch("https://randomuser.me/api/?results=8"); // Fetch 4 random users
        const data = await response.json();
        const users: RandomUser[] = data.results;

        // Map the API data to our Connection interface
        const mappedConnections: Connection[] = users.map(
          (user: RandomUser, index: number) => ({
            id: index + 1,
            name: `${user.name.first} ${user.name.last}`,
            image: user.picture.large,
          })
        );

        setConnections(mappedConnections);
      } catch (error) {
        console.error("Error fetching random users:", error);
        // Fallback demo data in case of an error
        setConnections([
          {
            id: 1,
            name: "Michel Alexandra",
            image: "https://via.placeholder.com/150",
          },
          {
            id: 2,
            name: "Michel Alexandra",
            image: "https://via.placeholder.com/150",
          },
          {
            id: 3,
            name: "Michel Alexandra",
            image: "https://via.placeholder.com/150",
          },
          {
            id: 4,
            name: "Michel Alexandra",
            image: "https://via.placeholder.com/150",
          },
        ]);
      }
    };

    fetchRandomUsers();
  }, []);

  return (
    <section className="w-full pt-2 pb-7 border-b-2">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-semibold">Requests</h1>
          <div className="size-6 rounded-full bg-primary flex items-center justify-center text-white">
            <h1 className="text-sm font-semibold">5</h1>
          </div>
        </div>
        <button className="text-primary hover:underline">Show more</button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {connections.length > 0 ? (
          connections.map((connection) => (
            <RequestedConnectionCard
              key={connection.id}
              name={connection.name}
              image={connection.image}
            />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </section>
  );
};

export default RequestedConnections;
