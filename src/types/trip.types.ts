interface ITripMedia {
  _id: string;
  mediaType: string;
  mediaUrl: string;
}
export interface ITripVisitedLocation {
  latitude: number;
  longitude: number;
}

interface ITrip {
  _id: string;
  content: string;
  media: ITripMedia[];
  visitedLocation: ITripVisitedLocation;
  visitedLocationName: string;
  distance: number
}

export default ITrip;