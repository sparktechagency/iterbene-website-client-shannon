export interface IGroupMember {
  _id: string;
  fullName: string;
  username: string;
  profileImage: string;
}

export interface ICoLeader {
  _id: string;
  fullName: string;
  username: string;
  profileImage: string;
}

export interface IGroup {
  _id: string;
  name: string;
  description: string;
  groupImage: string;
  creatorId: {
    _id: string;
    fullName: string;
    username: string;
    profileImage: string;
    description: string;
    createdAt: Date;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
  members: IGroupMember[];
  coLeaders: ICoLeader[];
  admin: string[];
  privacy: string;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}