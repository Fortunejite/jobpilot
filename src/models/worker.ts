import { Schema, model, models, Document, Model } from 'mongoose';

interface IWorker {
  userId: Schema.Types.ObjectId;
  exprience: string;
  education: string;
  avatar: string;
  title: string;
  website: string;
  resume: {
    url: string;
    name: string;
    size: number;
  }[];
  nationality: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  maritalStatus: 'Single' | 'Married' | 'Divorced';
  phoneNumber: string;
  address: string;
  biography: string;
  profession: string;
  links: {
    [x: string]: string;
  };
  favouriteJobs? : string[]
}

export interface IWorkerDocument extends IWorker, Document {}

const workerSchema: Schema<IWorkerDocument> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default:
        'https://firebasestorage.googleapis.com/v0/b/talking-34f62.appspot.com/o/fdb_user_pics%2F20210324081822-1267818948_avatar.jpg?alt=media&token=a0a9be6a-5277-493a-bd68-00f8a7473d9c',
    },
    exprience: {
      type: String,
    },
    education: {
      type: String,
    },
    title: {
      type: String,
    },
    website: {
      type: String,
    },
    resume: {
      type: [
        {
          name: { type: String },
          url: { type: String },
          size: { type: Number },
        },
      ],
    },
    phoneNumber: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced'],
    },
    address: {
      type: String,
    },
    biography: {
      type: String,
    },
    profession: {
      type: String,
    },
    nationality: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    links: {
      type: Map,
      of: String,
    },
    favouriteJobs: {
      type: [String],
    },
  },
  { timestamps: true },
);

const Worker: Model<IWorkerDocument> =
  models.Worker || model<IWorkerDocument>('Worker', workerSchema);
export default Worker;
