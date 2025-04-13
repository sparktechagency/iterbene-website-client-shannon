export interface IComment {
    id: string;
    username: string;
    profilePic: string;
    text: string;
    timestamp: string;
    replies?: IComment[];
  }
export interface IPost {
  id: string;
  username: string;
  profilePic: string;
  timestamp: string;
  location?: string;
  content: {
    text: string;
    media?: Array<{
      type: "photo" | "video";
      url: string;
    }>;
  };
  reactions: {
    love: number;
    luggage: number;
    ban: number;
    smile: number;
  };
  comments: IComment[];
  shares: number;
}