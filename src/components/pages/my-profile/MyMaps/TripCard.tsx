import Image from 'next/image';
import React from 'react';

interface TripCardProps {
  location: string;
  image: string;
  distance: string;
  rating: number;
  duration: string;
}

const TripCard: React.FC<TripCardProps> = ({ location, image, distance, rating, duration }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-4 flex flex-col border border-white">
      <Image src={image} alt={location} width={300} height={300} className="w-full h-60 rounded-xl object-cover" />
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-800">{location}</h3>
          <p className="text-sm text-gray-500">{distance}</p>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-yellow-500">★</span>
          <span className="text-sm text-gray-600">{rating}</span>
          <span className="text-sm text-gray-500">({duration})</span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;