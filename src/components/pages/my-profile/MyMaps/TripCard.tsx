import { Star } from 'lucide-react';
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
      <div className="w-full bg-white rounded-xl p-4 flex flex-col border border-[#E7E8EC] hover:shadow-xl transition-all duration-300 cursor-pointer">
      <Image src={image} alt={location} width={300} height={300} className="w-full h-60 rounded-xl object-cover" />
      <div className="flex gap-3 justify-between items-start pt-3">
        <div className='space-y-1'>
          <h3 className="text-xl font-medium text-gray-800">{location}</h3>
          <p className="text-base text-gray-400">{distance}</p>
          <span className="text-base text-gray-400">({duration})</span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={20} className="text-primary"/> 
          <span className="text-lg text-gray-600 font-semibold">{rating}</span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;