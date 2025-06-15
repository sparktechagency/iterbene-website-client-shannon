import { IMessage } from "./messagesType";

export interface IChat {
  _id: string;
  chatType: string;
  participants: string[];
  lastMessage?: IMessage;
  unviewedCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
