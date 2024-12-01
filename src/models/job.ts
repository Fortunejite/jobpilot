import { model, Model, models, Schema } from 'mongoose';

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
  jobType: 'Full Time' | 'Intern' | 'Part Time' | 'Contractual' | 'FreeLance';
  vacancies: number;
  expire: Date;
  country: string;
  benefits: string[];
  description: string;
  applyOn: 'jobPilot' | 'email' | 'other';
  skills: string[];
}

export interface IJobDocument extends IJob, Document {}

const jobSchema: Schema<IJobDocument> = new Schema();

const Job: Model<IJobDocument> =
  models.Employer || model<IJobDocument>('Job', jobSchema);

export default Job;
