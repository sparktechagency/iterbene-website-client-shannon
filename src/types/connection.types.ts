export interface ISuggestionUser {
  id: string;
  fullName: string;
  username: string;
  profileImage: string;
}

export interface IConnectionRequest {
  _id: string;
  sentBy: {
    _id: string;
    fullName: string;
    username: string;
    profileImage: string;
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMyConnections {
  _id: string;
  fullName: string;
  username: string;
  profileImage: string;
}

export interface IConnection {
  id: string;
  fullName: string;
  username: string;
  profileImage: string;
}
