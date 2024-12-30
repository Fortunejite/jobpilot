import { model, Model, models, Document, Schema } from 'mongoose';

export interface IApplication {
  workerId: Schema.Types.ObjectId | string;
  jobId: Schema.Types.ObjectId | string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  coverLetter: string;
  resume: string;
}

export interface IApplicationDocument extends IApplication, Document {}

const applicationSchema: Schema<IApplicationDocument> = new Schema(
  {
    workerId: {
      type: Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
    },
    coverLetter: {
      type: String,
    },
    resume: {
      type: String,
    },
  },
  { timestamps: true },
);

const Applicaton: Model<IApplicationDocument> =
  models.Application || model<IApplicationDocument>('Application', applicationSchema);
export default Applicaton;