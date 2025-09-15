export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  link?: string;
  following: string[];
  followers: string[];
}

export interface Post {
  _id: string;
  text: string;
  byUser: User;
  image?: string;
  comments: Comment[];
  likes: string[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  text: string;
  by: User;
  createdAt: string;
}
