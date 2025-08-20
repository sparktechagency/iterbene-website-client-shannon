export interface INotification {
  _id: string;
  title: string;
  message: string;
  receiverId: string;
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
