export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
  DOCUMENT = "document", // PDF, Word, etc.
  MIXED = "mixed", // Text + Media (Image, Audio, Video, PDF, etc.)
   STORYMESSAGE = 'storyMessage', // For story messages
  
}

export interface IContent {
  text?: string;
  messageType: MessageType;
  fileUrls?: string[];
}

export interface IMessage {
  _id?: string;
  chatId: string | string;
  senderId: string;
  receiverId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    profileImage: string
    email: string
  };
  storyMedia?:{
    _id: string
    backgroundColor: string
    mediaType: string
    textColor: string
    textContent: string
    textFontFamily: string
    textSize: number
    mediaUrl: string
  }
  content: IContent;
  seenBy?: string[];
  deletedBy?: string[];
  unsentBy?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
