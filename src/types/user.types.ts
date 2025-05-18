export interface IUser {
  _id?: string;
  fullName?: string;
  nickname?: string;
  username?: string;
  profileImage?: string;
  coverImage?: string;
  email?: string;
  phoneNumber?: string;
  referredAs?: string;
  age?: number;
  profession?: string;
  maritalStatus?: string;
  role?: string;
  followersCount?: number;
  followingCount?: number;
  isOnline?: boolean;
  createdAt?: Date;
}