export interface IEvent {
  _id: string;
  eventName: string;
  eventImage: string;
  creatorId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    username: string;
    profileImage: string;
  };
  description: string;
  interestCount: number;
  startDate: string;
  endDate: string;
}

export interface IEventDetails {
  _id: string;
  eventName: string;
  eventImage: string;
  eventCost?: number;
  creatorId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    username: string;
    profileImage: string;
    description: string;
  };
  interestCount: number;
  startDate: string;
  endDate: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
  duration: number;
  privacy: "public" | "private";
  pendingInterestedUsers: {
    _id: string;
    firstName?: string;
    lastName?: string;
    username: string;
    profileImage: string;
  }[];
  interestedUsers: {
    _id: string;
    firstName?: string;
    lastName?: string;
    username: string;
    profileImage: string;
  }[];
}

export interface IEventInvitation {
  _id: string;
  from: string;
  to: string;
  eventId: {
    _id: string;
    eventName: string;
    eventImage: string;
    startDate: string;
    endDate: string;
    creatorId: {
      _id: string;
      firstName?: string;
      lastName?: string;
      username: string;
      profileImage: string;
    };
    description: string;
    duration: {
      days: number;
      nights: number;
    };
    privacy: string;
    interestCount: number;
  };
  createdAt: string;
  updatedAt: string;
}
