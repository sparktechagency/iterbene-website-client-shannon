export interface IGroupMember {
  _id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  profileImage: string;
}

export interface ICoLeader {
  _id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  profileImage: string;
}

export interface IGroup {
  _id: string;
  name: string;
  groupImage: string;
  privacy: string;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}
export interface IGroupInvite {
  _id: string;
  from:string;
  to:string;
  groupId: {
    _id: string;
    name: string;
    groupImage: string;
    privacy: string;
    participantCount: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface IGroupDetails {
  _id: string;
  name: string;
  description: string;
  groupImage: string;
  creatorId: {
    _id: string;
    firstName?: string;
    lastName?: string;
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
  pendingMembers: IGroupMember[];
  admin: string[];
  privacy: string;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}
