import { Schema, model, models, Document, Model } from 'mongoose';

interface IWorker {
  userId: Schema.Types.ObjectId;
  profile: string;
  title: string;
  website: string;
  resume: string[];
  nationality: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  maritalStatus: 'Single' | 'Married' | 'Divorced';
  phoneNumber: string;
  address: string;
  biography: string;
  links: {
    facebook?: string;
    twitter?: string;
    linkedIn?: string;
    instagram?: string;
  }[];
}

export interface IWorkerDocument extends IWorker, Document {}

const userSchema: Schema<IWorkerDocument> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    profile: {
      type: String,
      default: '/icons/profile.png',
    },
    title: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    resume: {
      type: [String],
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    maritalStatus: {
      type: String,
    },
    address: {
      type: String,
    },
    biography: {
      type: String,
    },
    links: {
      type: [
        {
          facebook: String,
          twitter: String,
          linkedIn: String,
          instagram: String,
        },
      ],
    },
  },
  { timestamps: true },
);

const User: Model<IWorkerDocument> =
  models.User || model<IWorkerDocument>('User', userSchema);
export default User;
