import React from 'react';
import TripCard from './TripCard';

interface Trip {
  location: string;
  image: string;
  distance: string;
  rating: number;
  duration: string;
}

const TripList = ({ mapHide, showFullMap }: { mapHide: boolean, showFullMap: boolean }) => {
  const trips: Trip[] = [
    {
      location: 'Kyoto, Japan',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop', // Kyoto culture
      distance: '12,000 miles away',
      rating: 4.9,
      duration: '12 days & 11 nights',
    },
    {
      location: 'Santorini, Greece',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2000&auto=format&fit=crop', // Santorini scenery
      distance: '12,000 miles away',
      rating: 4.9,
      duration: '12 days & 11 nights',
    },
    {
      location: 'Banff, Canada',
      image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg', // Banff mountains
      distance: '12,000 miles away',
      rating: 4.9,
      duration: '12 days & 11 nights',
    },
    {
      location: 'Marrakech, Morocco',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2000&auto=format&fit=crop', // Marrakech market
      distance: '12,000 miles away',
      rating: 4.9,
      duration: '12 days & 11 nights',
    },
  ];

  return (
    <div className={`w-full p-1 md:p-4 grid grid-cols-1 gap-5 ${mapHide ? 'col-span-full md:grid-cols-3 lg:grid-cols-4' : showFullMap ? 'hidden' : 'col-span-1 md:grid-cols-2'}`}>
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