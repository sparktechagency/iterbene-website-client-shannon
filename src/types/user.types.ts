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
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed';
  role?: 'user' | 'admin' | 'moderator';
  isOnline?: boolean;
  createdAt?: Date;
}