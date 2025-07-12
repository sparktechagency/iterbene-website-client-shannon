export interface INotification {
  _id?: string;
  receiverId?: string | string;
  title: string;
  message?: string;
  image?: string;
  type: string;
  linkId?: string | string;
  role: "admin" | "user";
  viewStatus?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
