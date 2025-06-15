import { IMessage } from "./messagesType";

export interface IChat {
  _id: string;
  chatType: string;
  participants: string[];
  lastMessage?: IMessage;
  createdAt: Date;
  updatedAt: Date;
}
