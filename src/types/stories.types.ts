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
  viewedBY: IUser[];
  reactions: string[];
  replies: string[];
  privacy: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
