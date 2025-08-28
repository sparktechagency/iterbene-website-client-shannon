export interface ISuggestionUser {
  id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  profileImage: string;
}

export interface IConnectionRequest {
  _id: string;
  sentBy: {
    _id: string;
    firstName?: string;
    lastName?: string;
    username: string;
    profileImage: string;
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMyConnections {
  _id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  profileImage: string;
}

export interface IConnection {
  _id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  profileImage: string;
}
