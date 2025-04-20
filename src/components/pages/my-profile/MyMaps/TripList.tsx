import React from 'react';
import TripCard from './TripCard';

interface Trip {
  location: string;
  image: string;
  distance: string;
  rating: number;
  duration: string;
}

const TripList: React.FC = () => {
  const trips: Trip[] = [
    {
      location: 'Rome, Italy',
      image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg',
      distance: '12,000 miles away',
      rating: 4.9,
      duration: '12 days & 11 nights',
    },
    {
      location: 'Rome, Italy',
      image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg',
      distance: '12,000 miles away',
      rating: 4.9,
      duration: '12 days & 11 nights',
    },
    {
      location: 'Rome, Italy',
      image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg',
      distance: '12,000 miles away',
      rating: 4.9,
      duration: '12 days & 11 nights',
    },
    {
      location: 'Rome, Italy',
      image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg',
      distance: '12,000 miles away',
      rating: 4.9,
      duration: '12 days & 11 nights',
    },
  ];

  return (
    <div className="w-full p-4 grid grid-cols-1 md:grid-cols-2 gap-5">
      {trips.map((trip, index) => (
        <TripCard
          key={index}
          location={trip.location}
          image={trip.image}
          distance={trip.distance}
          rating={trip.rating}
          duration={trip.duration}
        />
      ))}
    </div>
  );
};

export default TripList;