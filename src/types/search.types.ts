export interface TUser {
  _id: string;
  fullName: string;
  username: string;
  profileImage: string;
}
export interface IHashtag {
  name: string;
  postCount: number;
}

export interface ISearchResult {
  users: TUser[];
  hashtags: IHashtag[];
}