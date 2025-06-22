interface IViewer {
  _id: string;
  fullName: string;
  username: string;
  profileImage: string;
}

interface IReactions {
  userId: {
    _id: string;
    fullName: string;
    username: string;
    profileImage: string;
  };
  reactionType: string;
}

interface IMedia {
  _id: string;
  mediaType: string;
  mediaUrl: string;
  textContent?: string;
  textFontFamily?: string;
  backgroundColor?: string;
}

interface IUser {
  _id: string;
  username: string;
  profileImage: string;
}
export interface IStory {
  _id: string;
  userId: IUser;
  mediaIds: IMedia[];
  viewedBy: IViewer[];
  reactions: IReactions[];
  viewCount: number;
  replies: string[];
  privacy: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
