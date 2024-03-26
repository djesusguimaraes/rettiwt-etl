import mongoose from "mongoose";

interface IUserData {
  id: string;
  userName: string;
  fullName: string;
  createdAt: string;
  description: string;
  isVerified: boolean;
  favouritesCount: number;
  followersCount: number;
  followingsCount: number;
  statusesCount: number;
  location: string;
  pinnedTweet: string;
  profileBanner: string;
  profileImage: string;
}

interface UserModelInterface extends mongoose.Model<UserDoc> {
  build(attr: IUserData): UserDoc;
}

interface UserDoc extends mongoose.Document {
  id: string;
  userName: string;
  fullName: string;
  createdAt: string;
  description: string;
  isVerified: boolean;
  favouritesCount: number;
  followersCount: number;
  followingsCount: number;
  statusesCount: number;
  location: string;
  pinnedTweet: string;
  profileBanner: string;
  profileImage: string;
}

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false,
  },
  userName: {
    type: String,
    required: false,
  },
  fullName: {
    type: String,
    required: false,
  },
  createdAt: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  isVerified: {
    type: Boolean,
    required: false,
  },
  favouritesCount: {
    type: Number,
    required: false,
  },
  followersCount: {
    type: Number,
    required: false,
  },
  followingsCount: {
    type: Number,
    required: false,
  },
  statusesCount: {
    type: Number,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  pinnedTweet: {
    type: String,
    required: false,
  },
  profileBanner: {
    type: String,
    required: false,
  },
  profileImage: {
    type: String,
    required: false,
  },
});

const UserData = mongoose.model<UserDoc, UserModelInterface>(
  "User",
  userSchema
);

userSchema.statics.build = (attr: IUserData) => new UserData(attr);

export { UserData, UserDoc };
