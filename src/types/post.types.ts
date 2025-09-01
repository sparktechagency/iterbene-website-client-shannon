import { IItinerary } from "./itinerary.types";

export interface ISortedReaction {
  type: string;
  count: number;
}

export interface IReaction {
  userId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    username: string;
    profileImage: string;
    id: string;
  };
  postId: string;
  reactionType: ReactionType;
  createdAt: Date;
}

export interface ICommentReaction {
  userId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    username: string;
    profileImage: string;
    id: string;
  };
  commentId: string;
  reactionType: ReactionType;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: string;
  userId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    username: string;
    profileImage: string;
  };
  postId: string;
  replyTo?: string;
  parentCommentId?: string;
  reactions: ICommentReaction[];
  comment: string;
  mentions?: [
    {
      _id: string;
      firstName?: string;
      lastName?: string;
      username: string;
      profileImage: string;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMedia {
  _id: string;
  mediaType: string;
  mediaUrl: string;
}

export interface IPost {
  _id: string;
  userId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    username: string;
    profileImage: string;
    id: string;
  };
  sourceId: string;
  postType: string;
  content: string;
  media: IMedia[];
  itinerary: IItinerary;
  sortedReactions: ISortedReaction[];
  visitedLocation?: {
    latitude: number;
    longitude: number;
  };
  visitedLocationName?: string;
  privacy: string;
  hashtags: string[];
  shareCount: number;
  isShared: boolean;
  itineraryViewCount: number;
  reactions: IReaction[];
  comments: IComment[];
  createdAt: Date;
}

export enum ReactionType {
  HEART = "heart",
  SUITCASE = "suitcase",
  NOT_INTERESTED = "not_interested",
  SMILE = "smile",
}

export enum PostPrivacy {
  PUBLIC = "public",
  FRIENDS = "friends",
  PRIVATE = "private",
}

export enum PostType {
  USER = "User",
  GROUP = "Group",
  EVENT = "Event",
}
