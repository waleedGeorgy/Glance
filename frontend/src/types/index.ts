export interface User {
  _id: string;
  username: string;
  fullName: string;
  profileImg?: string;
  coverImg?: string;
  bio?: string;
  link?: string;
  following: string[];
  followers: string[];
}

export interface Comment {
  _id: string;
  text: string;
  user: User;
  createdAt: string; // or Date if you parse it
}

export interface Post {
  _id: string;
  text: string;
  user: User;
  img?: string;
  comments: Comment[];
  likes: string[];
  createdAt: string; // or Date if you parse it
}
