import { Schema, model, models, Document, Model } from 'mongoose';

interface IWorker {
  userId: Schema.Types.ObjectId;
  exprience: string;
  education: string;
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
    [x: string]: string;
  };
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
    profile: {
      type: String,
      default: '/icons/profile.png',
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
      type: [String],
    },
    phoneNumber: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female']
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced']
    },
    address: {
      type: String,
    },
    biography: {
      type: String,
    },
    links: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true },
);

const Worker: Model<IWorkerDocument> =
  models.Worker || model<IWorkerDocument>('Worker', workerSchema);
export default Worker;
