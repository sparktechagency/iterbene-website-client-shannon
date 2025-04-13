'use client';
import React, { useState, useEffect } from 'react';
import AddConnectionCard from './add-connection.card';

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

const AddConnections: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);

  // Fetch random users when the component mounts
  useEffect(() => {
    const fetchRandomUsers = async () => {
      try {
        const response = await fetch('https://randomuser.me/api/?results=4'); // Fetch 4 random users
        const data = await response.json();
        const users: RandomUser[] = data.results;

        // Map the API data to our Connection interface
        const mappedConnections: Connection[] = users.map((user: RandomUser, index: number) => ({
          id: index + 1,
          name: `${user.name.first} ${user.name.last}`,
          image: user.picture.large,
        }));

        setConnections(mappedConnections);
      } catch (error) {
        console.error('Error fetching random users:', error);
        // Fallback demo data in case of an error
        setConnections([
          { id: 1, name: 'Michel Alexandra', image: 'https://via.placeholder.com/150' },
          { id: 2, name: 'Michel Alexandra', image: 'https://via.placeholder.com/150' },
          { id: 3, name: 'Michel Alexandra', image: 'https://via.placeholder.com/150' },
          { id: 4, name: 'Michel Alexandra', image: 'https://via.placeholder.com/150' },
        ]);
      }
    };

    fetchRandomUsers();
  }, []);

  return (
    <section className="w-full py-4 mt-7">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">People You Might Like</h1>
        <button className="text-primary hover:underline">Show more</button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {connections.length > 0 ? (
          connections.map((connection) => (
            <AddConnectionCard
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

export default AddConnections;