import { IItinerary } from "./itinerary.types";
import { IMedia } from "./post.types";

export interface TUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  profileImage: string;
}
export interface IHashtag {
  name: string;
  postCount: number;
}

export interface ISearchResult {
  users: TUser[];
  hashtags: IHashtag[];
}

export interface ISearchVisitedLocationDatas {
  locationName: string;
  imageUrl: string;
  visitedPlacesCount: number;
  locationId: string;
  latitude: number;
  longitude: number;
}

export interface IVisitedPlace {
  placeName: string;
  placeId: string;
  imageUrls: string[];
  rating: number;
  directionsUrl: string;
  distance?: number;
}

export interface ISearchPost {
  _id: string;
  media: IMedia[];
  visitedLocationName: string;
  distance: number;
  itinerary: IItinerary;
}
