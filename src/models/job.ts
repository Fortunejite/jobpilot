import { model, Model, models, Document, Schema } from 'mongoose';

export interface IJob {
  companyId?: Schema.Types.ObjectId;
  title: string;
  tags: string[];
  role: string;
  minSalary: number;
  maxSalary: number;
  salaryType: 'Hourly' | 'Monthly' | 'Project Basis';
  education: string;
  exprience: string;
  type: 'Full Time' | 'Intern' | 'Part Time' | 'Contractual' | 'FreeLance';
  vacancies: number;
  expire: Date;
  locationA: string;
  benefits: string[];
  description: string;
  applyOn: 'jobpilot' | 'email' | 'other';
  skills: string[];
  categoryId: Schema.Types.ObjectId | string;
  applications: Schema.Types.ObjectId[] | string[];
  createdAt: Date;
}

export interface IJobDocument extends IJob, Document {}

const jobSchema: Schema<IJobDocument> = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    minSalary: {
      type: Number,
      required: true,
    },
    maxSalary: {
      type: Number,
      required: true,
    },
    salaryType: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    exprience: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    vacancies: {
      type: Number,
      required: true,
    },
    expire: {
      type: Date,
      required: true,
    },
    locationA: {
      type: String,
      required: true,
    },
    benefits: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    applyOn: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    applications: {
      type: [Schema.Types.ObjectId],
      ref: 'Applicaton',
      required: true,
    },
  },
  { timestamps: true },
);

const Job: Model<IJobDocument> =
  models.Job || model<IJobDocument>('Job', jobSchema);

export default Job;
