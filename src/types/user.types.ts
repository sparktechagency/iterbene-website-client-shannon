export interface IUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  username?: string;
  profileImage?: string;
  coverImage?: string;
  email?: string;
  phoneNumber?: string;
  referredAs?: string;
  address?: string;
  ageRange?: string;
  country?: string;
  city?: string;
  state?: string;
  profession?: string;
  maritalStatus?: string;
  role?: string;
  followersCount?: number;
  followingCount?: number;
  isOnline?: boolean;
  createdAt?: Date;
}