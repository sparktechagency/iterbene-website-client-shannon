export interface IViewer {
  _id: string;
  fullName: string;
  username: string;
  profileImage: string;
}

export interface IReactions {
  userId: {
    _id: string;
    fullName: string;
    username: string;
    profileImage: string;
  };
  reactionType: string;
}

export interface IStoryMedia {
  _id: string;
  mediaUrl: string;
  textContent?: string;
  textFontFamily?: string;
  backgroundColor?: string;
  mediaType: string;
  viewedBy: IViewer[];
  viewCount: number;
  reactions: IReactions[];
  createdAt: Date;
}

interface IUser {
  _id: string;
  username: string;
  profileImage: string;
}
export interface IStory {
  _id: string;
  userId: IUser;
  mediaIds: IStoryMedia[];
  privacy: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
