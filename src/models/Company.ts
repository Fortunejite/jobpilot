import { Schema, model, models, Document, Model } from 'mongoose';

interface ICompany {
  userId: Schema.Types.ObjectId;
  logo: string;
  banner: string;
  companyName: string;
  about: string;
  orginizationType: string;
  industryType: string;
  teamSize: number;
  yearOfEstablishment: Date;
  website: string;
  vision: string;
  links: {
    [x: string]: string;
  };
  phoneNumber: string;
  address: string;
  email: string;
}

export interface ICompanyDocument extends ICompany, Document {}

const companySchema: Schema<ICompanyDocument> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    logo: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    companyName: {
      required: true,
      type: String,
    },
    website: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    industryType: {
      type: String,
      required: true,
    },
    orginizationType: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    vision: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    yearOfEstablishment: {
      required: true,
      type: Date,
    },
    links: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true },
);

const Company: Model<ICompanyDocument> =
  models.Company || model<ICompanyDocument>('Company', companySchema);
export default Company;
