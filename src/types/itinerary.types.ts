export interface IActivity {
  time: Date;
  description: string;
  link?: string;
  rating?: number;
  duration?: number;
  cost: number;
}

export interface IDay {
  dayNumber: number;
  location: {
    latitude: number;
    longitude: number;
  };
  activities: IActivity[];
  locationName: string;
  comment?: string;
  weather?: string;
}

export interface IItinerary {
  _id: string;
  userId: string;
  postId: string;
  tripName: string;
  travelMode: string;
  departure: string;
  arrival: string;
  days: IDay[];
  overAllRating: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
