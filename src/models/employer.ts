import { Schema, model, models, Document, Model } from 'mongoose';

interface IEmployer {
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

export interface IEmployerDocument extends IEmployer, Document {}

const employerSchema: Schema<IEmployerDocument> = new Schema(
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

const Employer: Model<IEmployerDocument> =
  models.Employer || model<IEmployerDocument>('Employer', employerSchema);
export default Employer;
