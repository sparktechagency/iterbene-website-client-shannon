export interface INotification {
  _id: string;
  title: string;
  message: string;
  username?: string;
  receiverId: string;
  senderId?: string;
  role: string;
  image?: string;
  type:
    | "post"
    | "story"
    | "comment"
    | "event"
    | "group"
    | "connection"
    | "message";
  linkId?: string;
  viewStatus: boolean;
  createdAt: string;
  updatedAt: string;
}
