import { Schema, model, models, Document, Model } from "mongoose";

interface IUser {
  email: string;
  fullName: string;
  password?: string;
  username: string;
  role: "worker" | "employer";
  provider?: string;
  avatar: string;
  isVerified: boolean;
}

export interface IUserDocument extends IUser, Document {}

const userSchema: Schema<IUserDocument> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    min: [6, "Must be atleast 6 characters"]
  },
  fullName: {
    type: String,
  },
  username: {
    type: String,
  },
  role: {
    type: String,
    enum: ["worker", "employer"],
    required: true
  },
  provider: {
    type: String
  },
  avatar: {
    type: String,
    default: '/icons/profile.png'
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {timestamps: true})

const User: Model<IUserDocument> = models.User || model<IUserDocument>('User', userSchema)
export default User