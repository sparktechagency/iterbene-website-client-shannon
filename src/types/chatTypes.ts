import { IMessage } from "./messagesType";
import { IUser } from "./user.types";

export interface IChat {
  _id: string;
  chatType: string;
  participants: (Partial<IUser> | string)[];
  lastMessage?: IMessage;
  unviewedCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
