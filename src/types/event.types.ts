export interface IEvent {
  _id: string;
  eventName: string;
  eventImage: string;
  creatorId: {
    _id: string;
    fullName: string;
    username: string;
    profileImage: string;
  };
  interestCount: number;
  startDate: string;
  endDate: string;
}
