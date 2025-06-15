export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
  DOCUMENT = "document", // PDF, Word, etc.
  MIXED = "mixed", // Text + Media (Image, Audio, Video, PDF, etc.)
}

export interface IContent {
  text?: string;
  messageType: MessageType;
  fileUrls?: string[];
}

export interface IMessage {
  _id?: string;
  chatId: string | string;
  senderId: {
    fullName: string;
    profileImage: {
      imageUrl: string;
      file: Record<string, unknown>;
    };
  };
  receiverId: string;
  content: IContent;
  seenBy?: string[];
  deletedBy?: string[];
  unsentBy?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
